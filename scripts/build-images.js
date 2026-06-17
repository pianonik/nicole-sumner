#!/usr/bin/env node
/* ============================================================
   build-media.js  (run: node scripts/build-images.js)
   Deterministically maps each resource in js/data.js to its
   source slide in the deck, then attaches:
     - LINKS   : every hyperlink on that slide (url + anchor text)   ← the point
     - cover   : the most prominent content image on the slide       (optional)
     - slideNum: page #, for a "More…" lightbox of the original slide

   Why links matter: the deck is a teacher *resource directory* —
   184 hyperlinks across 78 slides. Rendering slides to flat images
   would throw all of them away, so we extract them as real links.
   (Because links are preserved as text, the slide image itself can
   be low-quality JPG — see SLIDE_JPG_QUALITY — to save space.)

   Source of truth = pptx XML, not eyeballing. High-confidence only.

   Outputs: assets/img/auto/<id>.<ext>   (covers)
            assets/slides/slide-NNN.jpg   (all 133 slides, for gallery + lightbox)
            js/images.js                  (window.CT_MEDIA + CT_SLIDE_COUNT)
            scripts/mapping-report.json   (full audit)
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PPT = path.join(ROOT, 'assets/_extract/unpacked/ppt');
const RENDERS = path.join(ROOT, 'assets/_extract/slides_png');
const OUT_IMG = path.join(ROOT, 'assets/img/auto');
const OUT_SLIDES = path.join(ROOT, 'assets/slides');
const { RESOURCES } = require(path.join(ROOT, 'js/data.js'));

const VOICE_STOP = new Set(['nicole sumner']); // author: appears on too many slides
const SKIP_PAGE_MAX = 4;                        // cover / intro / contents / color key
const SLIDE_JPG_QUALITY = 9;                    // deployment: tiny files (links preserved separately)
const COVER_EXCLUDE = new Set([                 // verified text/quote graphics, not photos
  'three-universal-points', 'microaggressions-nadal', 'disclaimers-disney-wb', 'sfsu-first-departments',
]);

fs.rmSync(OUT_IMG, { recursive: true, force: true });
fs.rmSync(OUT_SLIDES, { recursive: true, force: true });
fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_SLIDES, { recursive: true });

/* ---------- helpers ---------- */
const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));

const slideText = xml => {
  const out = []; const re = /<a:t>([^<]*)<\/a:t>/g; let m;
  while ((m = re.exec(xml))) out.push(decode(m[1]));
  return out.join(' ').replace(/\s+/g, ' ').trim();
};

const slideImages = relsXml => {
  const out = []; const re = /<Relationship[^>]*Type="[^"]*\/image"[^>]*Target="\.\.\/media\/([^"]+)"/g;
  let m; while ((m = re.exec(relsXml))) out.push(m[1]);
  return out;
};

const humanHost = url => { try { return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; } catch { return 'link'; } };
// friendly fallback label when a link has no readable anchor text (e.g. a linked image)
const fallbackLabel = url =>
  /youtu\.?be|youtube\.com/i.test(url) ? '▶ Watch video' :
  /vimeo\.com/i.test(url) ? '▶ Watch video' :
  humanHost(url);

// hyperlinks on a slide: { text, url } deduped by url, external only.
// Captures BOTH text-run links and picture/shape (image) hyperlinks.
const slideLinks = (xml, relsXml) => {
  const url = {}; // rId -> url
  const re = /<Relationship[^>]*Id="(rId\d+)"[^>]*Type="[^"]*\/hyperlink"[^>]*Target="([^"]*)"/g;
  let m; while ((m = re.exec(relsXml))) url[m[1]] = decode(m[2]);

  const anchor = {}; // rId -> best anchor text
  // 1) text runs: a <a:r> whose run-properties carry an hlinkClick, with its <a:t> text
  for (const run of xml.matchAll(/<a:r>([\s\S]*?)<\/a:r>/g)) {
    const h = run[1].match(/<a:hlinkClick[^>]*r:id="(rId\d+)"/);
    const t = run[1].match(/<a:t>([^<]*)<\/a:t>/);
    if (h && t) { const id = h[1], txt = decode(t[1]).trim(); if (txt && !anchor[id]) anchor[id] = txt; }
  }
  // 2) picture/shape hyperlinks: <p:cNvPr ... descr/name ...><a:hlinkClick r:id=.../>
  for (const c of xml.matchAll(/<p:cNvPr\b([^>]*)>([\s\S]*?)<\/p:cNvPr>/g)) {
    const h = c[2].match(/<a:hlinkClick[^>]*r:id="(rId\d+)"/);
    if (!h || anchor[h[1]]) continue;
    let label = decode(((c[1].match(/descr="([^"]*)"/) || [])[1] || '')).trim();
    if (!label || /\.(jpe?g|png|gif|svg)$/i.test(label)) label = ''; // ignore filename-ish names
    if (label) anchor[h[1]] = label;
  }

  const byUrl = {};
  for (const rId of Object.keys(url)) {
    const u = url[rId]; if (!/^https?:\/\//i.test(u)) continue;     // external links only
    if (!byUrl[u]) byUrl[u] = { url: u, text: null };
    if (anchor[rId] && !byUrl[u].text) byUrl[u].text = anchor[rId];
  }
  return Object.values(byUrl).map(e => ({ text: e.text || fallbackLabel(e.url), url: e.url }));
};

const dimsCache = {};
const dims = file => {
  if (dimsCache[file]) return dimsCache[file];
  const p = path.join(PPT, 'media', file);
  try {
    const out = execSync(`identify -format "%w %h" ${JSON.stringify(p)}[0] 2>/dev/null`).toString().trim().split(/\s+/);
    return (dimsCache[file] = { w: +out[0] || 0, h: +out[1] || 0 });
  } catch { return (dimsCache[file] = { w: 0, h: 0 }); }
};

/* ---------- 1. presentation order (slideN.xml -> page index) ---------- */
const presRels = fs.readFileSync(path.join(PPT, '_rels/presentation.xml.rels'), 'utf8');
const ridToFile = {};
for (const m of presRels.matchAll(/Id="(rId\d+)"[^>]*Target="slides\/(slide\d+\.xml)"/g)) ridToFile[m[1]] = m[2];
const pres = fs.readFileSync(path.join(PPT, 'presentation.xml'), 'utf8');
const order = [...pres.matchAll(/<p:sldId [^>]*r:id="(rId\d+)"/g)].map(m => ridToFile[m[1]]);
const pageOf = {}; order.forEach((file, i) => { if (file) pageOf[file] = i + 1; });
const SLIDE_COUNT = order.filter(Boolean).length;

/* ---------- 2. slide inventory (text + images + LINKS) ---------- */
const slides = [];
for (const file of fs.readdirSync(path.join(PPT, 'slides')).filter(f => /^slide\d+\.xml$/.test(f))) {
  const xml = fs.readFileSync(path.join(PPT, 'slides', file), 'utf8');
  const relsPath = path.join(PPT, 'slides/_rels', file + '.rels');
  const rels = fs.existsSync(relsPath) ? fs.readFileSync(relsPath, 'utf8') : '';
  const text = slideText(xml);
  slides.push({ file, page: pageOf[file] || null, text, textLC: text.toLowerCase(),
    images: slideImages(rels), links: slideLinks(xml, rels) });
}

/* chrome/logo detection by CONTENT HASH (logo copies are renumbered per slide) */
const md5Cache = {};
const md5 = file => md5Cache[file] || (md5Cache[file] = (() => {
  try { return crypto.createHash('md5').update(fs.readFileSync(path.join(PPT, 'media', file))).digest('hex'); } catch { return file; }
})());
const hashSlides = {};
for (const s of slides) for (const im of s.images) { const h = md5(im); (hashSlides[h] = hashSlides[h] || new Set()).add(s.page); }
const CHROME_HASH = new Set(Object.keys(hashSlides).filter(h => hashSlides[h].size >= 3));
const isChrome = f => CHROME_HASH.has(md5(f));

/* ---------- 3. match each resource to a slide ---------- */
const STOP = new Set('the a an of to in for and or is are be we our you your with on as it that this how what who not by from at into can their them they i if do does'.split(' '));
const tokenize = s => (s.toLowerCase().match(/[a-zà-ÿ']{3,}/g) || []).filter(t => !STOP.has(t));

function scoreSlide(res, slide) {
  let voiceHit = false;
  for (const v of res.voices) if (v && !VOICE_STOP.has(v.toLowerCase()) && slide.textLC.includes(v.toLowerCase())) voiceHit = true;
  const rTok = new Set(tokenize(res.title + ' ' + (res.body || '') + ' ' + (res.source || '')));
  const sTok = new Set(tokenize(slide.text));
  let overlap = 0; for (const t of rTok) if (sTok.has(t)) overlap++;
  const ratio = rTok.size ? overlap / rTok.size : 0;
  return { score: (voiceHit ? 100 : 0) + overlap, voiceHit, overlap, ratio };
}

function pickCover(slide) {
  const cands = slide.images
    .filter(f => !isChrome(f))
    .map(f => ({ f, ...dims(f) }))
    .filter(d => d.w >= 200 && d.h >= 150)
    .filter(d => { const r = d.w / d.h; return r >= 0.5 && r <= 2.2; })
    .sort((a, b) => b.w * b.h - a.w * a.h);
  return cands[0] || null;
}

const report = [];
const media = {};   // resId -> { cover?, slideNum, links }
for (const res of RESOURCES) {
  let best = null, bestS = null;
  for (const s of slides) {
    if (!s.page || s.page <= SKIP_PAGE_MAX) continue;
    const sc = scoreSlide(res, s);
    if (!best || sc.score > bestS.score) { best = s; bestS = sc; }
  }
  const confident = bestS && (bestS.voiceHit || (bestS.overlap >= 6 && bestS.ratio >= 0.4));
  const cover = confident && best && !COVER_EXCLUDE.has(res.id) ? pickCover(best) : null;
  const links = confident && best ? best.links : [];
  report.push({
    id: res.id, title: res.title, slide: best ? best.page : null,
    score: bestS.score, voiceHit: bestS.voiceHit, overlap: bestS.overlap, ratio: +bestS.ratio.toFixed(2),
    confident: !!confident, cover: cover ? cover.f : null, links: links.length,
  });
  if (confident && best && (cover || links.length)) {
    media[res.id] = { slideNum: best.page };   // links live in the per-slide map (CT_SLIDE_LINKS)
    if (cover) media[res.id].cover = cover;
  }
}

/* per-slide link map — EVERY slide's links, so the gallery/lightbox can
   surface them even when no resource mapped to that slide (nothing lost). */
const slideLinkMap = {};
for (const s of slides) if (s.page && s.links.length) slideLinkMap[s.page] = s.links;

/* ---------- 4. emit cover images ---------- */
const CT_MEDIA = {};
for (const [id, m] of Object.entries(media)) {
  const entry = { slideNum: m.slideNum };
  if (m.cover) {
    // covers are just thumbnails — always JPG, capped at 800px, to keep the deploy small
    const out = path.join(OUT_IMG, `${id}.jpg`);
    execSync(`magick ${JSON.stringify(path.join(PPT, 'media', m.cover.f))} -background white -flatten -resize 800x800\\> -quality 82 -strip ${JSON.stringify(out)}`);
    entry.cover = `assets/img/auto/${id}.jpg`;
  }
  CT_MEDIA[id] = entry;
}

/* ---------- 5. convert ALL slides -> space-saving JPG (gallery + lightbox) ---------- */
let converted = 0;
for (let p = 1; p <= SLIDE_COUNT; p++) {
  const pg = String(p).padStart(3, '0');
  const src = path.join(RENDERS, `slide-${pg}.png`);
  if (!fs.existsSync(src)) continue;
  execSync(`magick ${JSON.stringify(src)} -resize 1000x1000\\> -quality ${SLIDE_JPG_QUALITY} -strip ${JSON.stringify(path.join(OUT_SLIDES, `slide-${pg}.jpg`))}`);
  converted++;
}

/* ---------- 6. write outputs ---------- */
const banner = `/* AUTO-GENERATED by scripts/build-images.js — do not edit by hand.
   CT_MEDIA      : resource id -> { cover?, slideNum }
   CT_SLIDE_LINKS: slide # -> [{text,url}]  (EVERY slide's links)
   CT_SLIDE_COUNT: total slides (gallery uses assets/slides/slide-NNN.jpg)
   Re-run: node scripts/build-images.js */\n`;
const js = banner +
  'const CT_MEDIA = ' + JSON.stringify(CT_MEDIA, null, 1) + ';\n' +
  'const CT_SLIDE_LINKS = ' + JSON.stringify(slideLinkMap, null, 1) + ';\n' +
  'const CT_SLIDE_COUNT = ' + SLIDE_COUNT + ';\n' +
  "if (typeof window !== 'undefined') { window.CT_MEDIA = CT_MEDIA; window.CT_SLIDE_LINKS = CT_SLIDE_LINKS; window.CT_SLIDE_COUNT = CT_SLIDE_COUNT; }\n";
fs.writeFileSync(path.join(ROOT, 'js/images.js'), js);
fs.writeFileSync(path.join(__dirname, 'mapping-report.json'), JSON.stringify(report, null, 2));

/* ---------- 7. summary ---------- */
const linkSlides = Object.keys(slideLinkMap).length;
const totalLinks = Object.values(slideLinkMap).reduce((n, l) => n + l.length, 0);
const mappedSlides = new Set(Object.values(CT_MEDIA).map(m => m.slideNum));
const surfacedViaResource = Object.keys(slideLinkMap).filter(p => mappedSlides.has(+p)).length;
console.log(`\nSlides: ${SLIDE_COUNT} parsed, ${converted} converted to JPG q${SLIDE_JPG_QUALITY}`);
console.log(`Resources mapped: ${Object.keys(CT_MEDIA).length} / ${RESOURCES.length} (${Object.values(CT_MEDIA).filter(m => m.cover).length} with cover)`);
console.log(`Links: ${totalLinks} across ${linkSlides} slides — ALL reachable via the gallery lightbox.`);
console.log(`  also shown on a mapped resource card: ${surfacedViaResource} slides' worth`);
console.log(`Low-confidence / unmapped resources: ${report.filter(r => !r.confident).length}`);

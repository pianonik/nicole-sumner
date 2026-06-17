#!/usr/bin/env node
/* ============================================================
   build-slides-html.js   (run: node scripts/build-slides-html.js)
   Renders every slide of the deck to faithful HTML/CSS with REAL,
   inline-clickable links — so Google Slides can stay Nicole's CMS
   (edit in Slides → export .pptx → rebuild → site regenerates).

   Per slide: absolutely-positioned <div>s (text) + <img>s (pictures)
   from the pptx XML, scaled responsively via container queries.
   Handles: shape fills (disambiguated from borders), borders,
   rotation/flip, roundRect, autofit font scaling, alignment,
   vertical anchor, bold/italic/color/font, inline hyperlinks,
   picture hyperlinks, slide background. (Deck has no grouped shapes.)

   Outputs: assets/slidimg/<hash>.<ext>  (deduped slide images)
            js/slides-html.js            (window.CT_SLIDE_HTML)
   The flat JPGs (assets/slides) remain as a fallback.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PPT = path.join(ROOT, 'assets/_extract/unpacked/ppt');
const OUT_IMG = path.join(ROOT, 'assets/slidimg');
fs.rmSync(OUT_IMG, { recursive: true, force: true });
fs.mkdirSync(OUT_IMG, { recursive: true });

const EMU_W = 9144000, EMU_H = 5143500;
const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (xml, name) => { const m = xml.match(new RegExp(name + '="([^"]*)"')); return m ? m[1] : null; };

const ALIGN = { l: 'left', ctr: 'center', r: 'right', just: 'justify' };
const ANCHOR = { t: 'flex-start', ctr: 'center', b: 'flex-end' };
const FONT_MAP = { 'Comic Sans MS': "'Comic Sans MS','Permanent Marker',cursive" };
const fontFor = tf => tf ? (FONT_MAP[tf] || `'${tf}', Inter, Arial, sans-serif`) : 'Inter, Arial, sans-serif';

/* theme colour map: resolve schemeClr names (dk1/lt1/accent1…) to hex */
const themeXml = fs.readFileSync(path.join(PPT, 'theme/theme1.xml'), 'utf8');
const clrScheme = (themeXml.match(/<a:clrScheme[^>]*>([\s\S]*?)<\/a:clrScheme>/) || [])[1] || '';
const themeMap = {};
for (const m of clrScheme.matchAll(/<a:(dk1|lt1|dk2|lt2|accent[1-6]|hlink|folHlink)>\s*<a:(srgbClr|sysClr) val="([^"]+)"(?:[^>]*lastClr="([^"]+)")?/g))
  themeMap[m[1]] = m[2] === 'srgbClr' ? m[3] : (m[4] || m[3]);
const ALIAS = { tx1: 'dk1', bg1: 'lt1', tx2: 'dk2', bg2: 'lt2' };
const toHex = (type, val) => type === 'srgbClr' ? val : (themeMap[ALIAS[val] || val] || null);
// first colour inside a snippet wrapped by `wrap` (e.g. 'solidFill','highlight')
const colorIn = (snippet, wrap) => {
  const m = snippet.match(new RegExp(`<a:${wrap}>\\s*<a:(srgbClr|schemeClr) val="([^"]+)"`));
  return m ? toHex(m[1], m[2]) : null;
};

/* ---- dedup + optimize slide images ---- */
const imgOutCache = {}; // md5 -> assets path
function exportImage(file) {
  const src = path.join(PPT, 'media', file);
  const buf = fs.readFileSync(src);
  const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 12);
  if (imgOutCache[hash]) return imgOutCache[hash];
  // keep PNG only when it has real transparency; otherwise JPG (much smaller)
  let opaque = true;
  try { opaque = execSync(`magick identify -format "%[opaque]" ${JSON.stringify(src)}[0] 2>/dev/null`).toString().trim() === 'True'; } catch {}
  const ext = opaque ? 'jpg' : 'png';
  const out = path.join(OUT_IMG, `${hash}.${ext}`);
  const opt = opaque ? '-background white -flatten -quality 78 -strip' : '-strip';
  execSync(`magick ${JSON.stringify(src)} -resize 820x820\\> ${opt} ${JSON.stringify(out)}`);
  return (imgOutCache[hash] = `assets/slidimg/${hash}.${ext}`);
}

/* ---- presentation order: page -> slideN.xml ---- */
const presRels = fs.readFileSync(path.join(PPT, '_rels/presentation.xml.rels'), 'utf8');
const r2f = {}; for (const m of presRels.matchAll(/Id="(rId\d+)"[^>]*Target="slides\/(slide\d+\.xml)"/g)) r2f[m[1]] = m[2];
const pres = fs.readFileSync(path.join(PPT, 'presentation.xml'), 'utf8');
const order = [...pres.matchAll(/<p:sldId [^>]*r:id="(rId\d+)"/g)].map(m => r2f[m[1]]);

/* ---- render a text body to paragraph HTML ---- */
function renderText(txBody, links) {
  const scale = +((txBody.match(/<a:normAutofit[^>]*fontScale="(\d+)"/) || [])[1] || 100000) / 100000;
  let html = '';
  for (const p of txBody.matchAll(/<a:p>([\s\S]*?)<\/a:p>/g)) {
    const b = p[1];
    const pPr = (b.match(/<a:pPr\b([^>]*?)\/?>/) || [])[1] || '';
    const align = ALIGN[attr(pPr, 'algn')] || 'left';
    let runs = '';
    for (const node of b.matchAll(/<a:r>([\s\S]*?)<\/a:r>|<a:br\s*\/>/g)) {
      if (node[0].startsWith('<a:br')) { runs += '<br>'; continue; }
      const r = node[1];
      const rPr = (r.match(/<a:rPr\b([^>]*?)\/?>/) || [])[1] || '';
      const t = (r.match(/<a:t>([\s\S]*?)<\/a:t>/) || [])[1];
      if (t == null) continue;
      const sz = +(attr(rPr, 'sz') || 1800) / 100;
      const color = colorIn(r, 'solidFill');
      const highlight = colorIn(r, 'highlight');
      const face = (r.match(/<a:latin[^>]*typeface="([^"]*)"/) || [])[1];
      const hl = (r.match(/<a:hlinkClick[^>]*r:id="(rId\d+)"/) || [])[1];
      let st = `font-size:${(sz * scale * 1.3333 / 9.6).toFixed(3)}cqw;`;
      if (highlight) st += `background:#${highlight};box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:0.05em 0;`;
      if (attr(rPr, 'b') === '1') st += 'font-weight:700;';
      if (attr(rPr, 'i') === '1') st += 'font-style:italic;';
      if (attr(rPr, 'u') && attr(rPr, 'u') !== 'none') st += 'text-decoration:underline;';
      if (face) st += `font-family:${fontFor(face)};`;
      const url = hl && links[hl];
      if (url) {
        st += `color:${color ? '#' + color : '#1155cc'};text-decoration:underline;`;
        runs += `<a href="${esc(url)}" target="_blank" rel="noopener" style="${st}">${esc(decode(t))}</a>`;
      } else {
        if (color) st += `color:#${color};`;
        runs += `<span style="${st}">${esc(decode(t))}</span>`;
      }
    }
    html += `<p style="text-align:${align}">${runs || '&nbsp;'}</p>`;
  }
  return html;
}

function renderSlide(file) {
  const xml = fs.readFileSync(path.join(PPT, 'slides', file), 'utf8');
  const relsXml = fs.readFileSync(path.join(PPT, 'slides/_rels', file + '.rels'), 'utf8');
  const img = {}, links = {};
  for (const m of relsXml.matchAll(/Id="(rId\d+)"[^>]*Type="[^"]*\/image"[^>]*Target="\.\.\/media\/([^"]+)"/g)) img[m[1]] = m[2];
  for (const m of relsXml.matchAll(/Id="(rId\d+)"[^>]*Type="[^"]*\/hyperlink"[^>]*Target="([^"]*)"/g)) links[m[1]] = decode(m[2]);

  const bg = (xml.match(/<p:bg>[\s\S]*?<a:srgbClr val="([0-9A-Fa-f]{6})"/) || [])[1] || 'FFFFFF';
  let out = `<div class="slide-html" style="background:#${bg}">`;

  for (const node of xml.matchAll(/<p:(sp|pic)>([\s\S]*?)<\/p:\1>/g)) {
    const kind = node[1], body = node[2];
    const xf = (body.match(/<a:xfrm\b([^>]*)>/) || [])[1] || '';
    const off = body.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>/);
    const ext = body.match(/<a:ext cx="(\d+)" cy="(\d+)"\/>/);
    if (!off || !ext) continue;
    const L = (+off[1] / EMU_W * 100), T = (+off[2] / EMU_H * 100);
    const W = (+ext[1] / EMU_W * 100), H = (+ext[2] / EMU_H * 100);
    let style = `position:absolute;left:${L.toFixed(2)}%;top:${T.toFixed(2)}%;width:${W.toFixed(2)}%;height:${H.toFixed(2)}%;`;
    // rotation / flip
    const rot = +(xf.match(/rot="(-?\d+)"/) || [])[1] || 0;
    const flipH = /flipH="1"/.test(xf), flipV = /flipV="1"/.test(xf);
    const tf = [];
    if (rot) tf.push(`rotate(${(rot / 60000).toFixed(2)}deg)`);
    if (flipH) tf.push('scaleX(-1)');
    if (flipV) tf.push('scaleY(-1)');
    if (tf.length) style += `transform:${tf.join(' ')};`;

    if (kind === 'pic') {
      const embed = (body.match(/<a:blip[^>]*r:embed="(rId\d+)"/) || [])[1];
      const f = embed && img[embed];
      if (!f) continue;
      const src = exportImage(f);
      const hl = (body.match(/<a:hlinkClick[^>]*r:id="(rId\d+)"/) || [])[1];
      let el = `<img src="${src}" style="width:100%;height:100%;object-fit:contain" alt="" loading="lazy">`;
      if (hl && links[hl]) el = `<a href="${esc(links[hl])}" target="_blank" rel="noopener" title="${esc(links[hl])}" style="display:block;width:100%;height:100%">${el}</a>`;
      out += `<div style="${style}">${el}</div>`;
    } else {
      const spPr = (body.match(/<p:spPr>([\s\S]*?)<\/p:spPr>/) || [])[1] || '';
      const preLn = spPr.split('<a:ln')[0];                       // shape fill lives before the line/border
      const fill = /<a:noFill\/>/.test(preLn) ? null : colorIn(preLn, 'solidFill');
      const lnPart = spPr.includes('<a:ln') ? spPr.slice(spPr.indexOf('<a:ln')) : '';
      const lnColor = /<a:ln[^>]*>\s*<a:noFill\/>/.test(lnPart) ? null : colorIn(lnPart, 'solidFill');
      const geom = (body.match(/<a:prstGeom prst="([^"]*)"/) || [])[1];
      const anchorRaw = ((body.match(/<a:bodyPr\b([^>]*)>/) || [])[1] || '').match(/anchor="([a-z]+)"/);
      const anchor = ANCHOR[anchorRaw && anchorRaw[1]] || 'flex-start';
      const txBody = (body.match(/<p:txBody>([\s\S]*?)<\/p:txBody>/) || [])[1] || '';
      if (fill) style += `background:#${fill};`;
      if (lnColor) style += `border:0.13cqw solid #${lnColor};`;
      if (geom === 'roundRect') style += 'border-radius:1.2cqw;';
      style += `display:flex;flex-direction:column;justify-content:${anchor};padding:0.3cqw 0.55cqw;overflow:hidden;`;
      out += `<div style="${style}">${renderText(txBody, links)}</div>`;
    }
  }
  return out + '</div>';
}

/* ---- build all slides ---- */
const CT_SLIDE_HTML = {};
order.forEach((file, i) => { if (file) CT_SLIDE_HTML[i + 1] = renderSlide(file); });

const banner = `/* AUTO-GENERATED by scripts/build-slides-html.js — do not edit by hand.
   CT_SLIDE_HTML: slide # -> faithful HTML fragment (real text + inline links).
   Re-run after editing the deck in Google Slides: export .pptx, unzip into
   assets/_extract/unpacked, then: node scripts/build-slides-html.js */\n`;
fs.writeFileSync(path.join(ROOT, 'js/slides-html.js'),
  banner + 'const CT_SLIDE_HTML = ' + JSON.stringify(CT_SLIDE_HTML) + ';\n' +
  "if (typeof window !== 'undefined') window.CT_SLIDE_HTML = CT_SLIDE_HTML;\n");

const jsKB = (fs.statSync(path.join(ROOT, 'js/slides-html.js')).size / 1024).toFixed(0);
const imgN = fs.readdirSync(OUT_IMG).length;
let imgKB = 0; for (const f of fs.readdirSync(OUT_IMG)) imgKB += fs.statSync(path.join(OUT_IMG, f)).size;
console.log(`Rendered ${Object.keys(CT_SLIDE_HTML).length} slides -> js/slides-html.js (${jsKB} KB)`);
console.log(`Slide images (deduped): ${imgN} files, ${(imgKB / 1048576).toFixed(1)} MB in assets/slidimg/`);

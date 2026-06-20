# Courageous Teachers — History

## 2026-06-19 (slides) — Fix slide cropping; drop redundant links panel; YouTube lightbox

**User:** Reviewed the live site with Nicole and recorded a VibeNik walkthrough (`vibenik-2026-06-19-19-35-56`) flagging three things: (1) text is **cropped** on a bunch of HTML slides — "things that are a weird angle are cropped sometimes"; (2) "I don't want this links on the slide thing… these links here [inline on the slide] are perfectly good"; (3) for YouTube links, "bring them up in a sort of light box thing like we do here on Mo4k.com." Then: "make sure you regenerate **all** of the slides", and finally "push to github and github pages."

**Response — committed `9db69b1`, live on Pages:**
- **Diagnosed the cropping from the source, not by eye.** Two compounding causes: (a) runs without an explicit font were falling back to **Inter**, but the deck's theme + slide master default is **Arial** (Inter is wider → more wrapping → overflow); (b) the renderer ignored the deck's real line spacing — 30 slides set `lnSpcReduction`, 287 paragraphs set explicit `<a:lnSpc>` spcPct — and clipped overflow with `overflow:hidden`.
- **Fixes in `scripts/build-slides-html.js`:** base font → Arial (missing named fonts also degrade to Arial, not Inter); honor per-paragraph `spcPct` and `normAutofit` `lnSpcReduction` with a "single-spacing" base of **1.02** tuned to the deck's own PDF render (1.12 was too loose); text boxes no longer clip (`overflow:visible` — PowerPoint never clips text either); each text box's content wrapped in a `.tw` div.
- **Shrink-to-fit (the guarantee), `js/main.js`:** when the browser still renders a box taller than the deck sized it for, `fitSlideText()` scales the `.tw` down at lightbox-open time — exactly what PowerPoint/Google Slides autofit does. Reordered `openLightbox` to show the lightbox *before* measuring so heights are real. An automated Playwright audit over **all 133 slides** went from whole lines cut off to **zero slides with text past the slide edge**; smallest applied scale 0.675 (still legible). Verified the worst cases visually: slide 11 Sadhguru bubble, slide 19 Alicia Keys quote, slide 41 rotated "banned books" note — all now complete top-to-bottom.
- **Links panel:** the "Links on this slide" side panel now shows **only** on flat-JPG fallback slides (where inline links don't exist); on the ~131 HTML slides the inline links suffice, so the duplicate panel is gone.
- **YouTube lightbox:** YouTube links (`watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `live/`) are intercepted on `#lbStage`/`#lbLinks` and play in a centered `.video-overlay` iframe (Esc / click-outside / ✕; Esc closes the video first via a capture-phase handler). Verified with the Vandana Shiva "7-minute video" Nicole flagged earlier.
- **Regenerated all 133 slides** (`js/slides-html.js`, 370 KB); confirmed every text-bearing slide carries the `.tw` wrapper (the 5 without it — 114/119/130/131/132 — are image-only, correct). Did **not** re-run `build-images.js` (inputs unchanged → identical output).
- **Deploy:** `cmt` → push `041b8bd..9db69b1`; Pages rebuilt in ~16s; verified the **live** JS actually contains `fitSlideText`, `video-overlay`, and `.tw` (not just the commit). All pages HTTP 200.

**Files:** `scripts/build-slides-html.js`, `js/main.js`, `css/style.css`, `js/slides-html.js` (regenerated).
**Live:** https://pianonik.github.io/nicole-sumner/

## 2026-06-17 (docs) — Draft email to Nicole (uncommitted)

**User:** "Draft an email to Nicole in docs/site-plan.md explaining what we did and come up with some questions/suggestions for her on how it could be improved."

**Response:** Created `docs/site-plan.md` — a plain-language draft email (no technical jargon, per the updated `~/.claude/CLAUDE.md` instruction to use plain English) from Nick to Nicole. Covers: the slideshow → searchable/filterable library reframe; that every link in the deck is now clickable on the slides (incl. the Vandana Shiva 7-min and Mari Copeny video links she flagged); her bold look/logo preserved; and the headline workflow — she keeps authoring in Google Slides and the site mirrors it. Includes two honest caveats (it's a draft; third-party image permissions now that it's public), six questions for her (audience, look, groupings/tags, image ownership, contact option, custom domain), and four suggestions (interactive Spectrum of Action + Scorecard, a Voices page, accessibility/readability pass, a welcome/orientation). Uncommitted at time of writing (untracked `docs/`).

## 2026-06-17 (deploy) — Live on GitHub Pages

**User:** "can you push this stuff to a spot on github pages?" — then confirmed "that is publically accessible."

**Response:**
- Flagged that Pages is outward-facing: it publishes the site to a public, indexable URL, and on a free plan the repo must be public too. User accepted public.
- Pushed the pending HTML-slides work first via `cmt` (commit `51c83bf`, 150 files) so the remote had the latest, after `git add -A` (cmt's `git commit -a` won't stage new files like `js/slides-html.js`, `assets/slidimg/`).
- Added `.nojekyll` at repo root so Pages serves files as-is (no Jekyll processing of any `_`-prefixed paths).
- `gh repo edit pianonik/nicole-sumner --visibility public --accept-visibility-change-consequences` → repo PUBLIC.
- Enabled Pages from `main` / root: `echo '{"source":{"branch":"main","path":"/"}}' | gh api --method POST repos/pianonik/nicole-sumner/pages --input -`.
- Polled the build to `built`; verified the **live** site (not just local): `https://pianonik.github.io/nicole-sumner/` — all pages HTTP 200, and headless Chromium against the live URL confirmed the slide lightbox renders the HTML with 10 inline links on slide 62, no 404s, no console errors. All paths are relative, so they resolve correctly under the `/nicole-sumner/` subpath.
- Committed a `.gitignore` tweak for `live-*.png` screenshot artifacts (`ac9d9da`).

**Live URL:** https://pianonik.github.io/nicole-sumner/ — auto-rebuilds on every push to `main`.
**Open:** copyright pass on third-party images is now a real pre-share to-do (public, indexable site).

## 2026-06-17 (repo) — Created pianonik/nicole-sumner, no LFS needed

**User:** "create a repo for this in pianonik@github - call it nicole-sumner and then push to it. Surely we need to enable LFS for this."

**Response:**
- Pushed back on LFS and verified rather than assumed: the heavy build inputs (`assets/_extract/`, ~315 MB — pptx/pdf/unzipped media/slide PNGs) are **gitignored**; only ~6.5 MB of small files was tracked, largest single file 140 KB — far under GitHub's 50/100 MB thresholds. So plain git, **no LFS**.
- `gh` was authed as **pianonik** (SSH, `repo` scope). Read `~/Developer/moForte/scripts/cmt` to use it correctly (prepends `+->=branch=<branch>`, then `ssh-add moforte.pem` + `git push`).
- `git init -b main` → `git config --local push.autoSetupRemote true` → `git add -A` → `gh repo create pianonik/nicole-sumner --private --source=. --remote=origin` (no push) → committed+pushed via `cmt` (initial commit `a438479`, 192 files). Sanity-checked 0 `_extract` files staged.
- Created it **private** initially as a deliberate default given the un-cleared third-party images (later made public for Pages — see deploy entry above).

## 2026-06-17 — Faithful PPTX→HTML slides (Google Slides becomes the CMS)

**User:** Drop the "original slide" wording (just "More…"); can the actual links be clickable on the slide, not just a list?; can we convert the deck to faithful HTML5+CSS? — "if we can pull it off then we can let her continue to work with the slides, since she's obviously so good at it." Chose **full rollout, all 133**.

**Response — built a PPTX→HTML renderer** (`scripts/build-slides-html.js`) so slides become real HTML with **inline clickable links**, unlocking the workflow: she edits in Google Slides → export `.pptx` → unzip into `assets/_extract/unpacked` → `node scripts/build-slides-html.js` → site regenerates. No website hand-editing.
- Renders each slide as absolutely-positioned `<div>`/`<img>` from EMU coords → %, scaled responsively via CSS **container queries** (`cqw` font sizes). Handles: shape fills (disambiguated from borders via pre-`<a:ln>` split), borders, rotation/flip, roundRect, **autofit fontScale**, alignment, vertical anchor, bold/italic, **srgb + theme (schemeClr) colors**, **text highlights** (the red/black bold bars — 22 slides), fonts (Comic Sans→Permanent Marker), inline + picture hyperlinks, slide background. Deck has **no grouped shapes** (checked) — so no nested-coord handling needed.
- Debugged via headless screenshots (Playwright): fixed color-inheritance (faint title), autofit (giant quote text), fill-vs-border disambiguation (logo black-box), and theme-color highlights (missing black bar). Title slide now faithful; content slides (108 etc.) essentially pixel-faithful with live links.
- Image handling: dedupe by md5, convert opaque PNG→JPG, cap 820px → `assets/slidimg/` cut **54 MB → 12 MB**. `js/slides-html.js` = 348 KB (inlined so it works from `file://`).
- Wired into the lightbox: `#lbImg` → `#lbStage`; renders `CT_SLIDE_HTML[n]` with the **flat JPG as automatic fallback**. Renamed button to "More…" (dropped "original slide"). Gallery thumbnails stay flat JPG (perf); full view = HTML.
- Verified: resource card → More… → HTML slide w/ 10 inline links (real URLs); no 404s, no console errors across all pages.

## 2026-06-17 — Links audit: per-slide links, nothing lost

**User:** Spotted that the "7 minute video" (Vandana) and "Video about Mari Copeny" links — clickable in Google Slides — didn't seem clickable on the site; asked to "check all the slides for problems like this."

**Response:** Those two were actually captured (he was looking at the flat slide image in the lightbox, where links are just pixels). But the audit found the real, systemic bug: **links were only attached to the 76 mapped resources, so 35 links across 21 slides — slide 80 alone had 11 — were absent from the site entirely** (links on slides no resource mapped to). Fixes:
- Generated a **per-slide** link map `CT_SLIDE_LINKS` (slide # → links) covering **all 148 links across 77 slides**, independent of resource mapping.
- The **lightbox now shows that slide's links as clickable items** beside the image — so every link is reachable from the All Slides gallery (all 133 slides), not just mapped resources. Resource modals and card 🔗 badges now read from the same per-slide map.
- Hardened extraction: **run-based** anchor parsing (not a brittle "hlinkClick immediately before `</a:rPr>`" regex) + **picture/shape (image) hyperlinks** + friendly "▶ Watch video" label for anchorless video thumbnails.
- Re-audit: **0 links lost.** 131/148 have real anchor text; the 17 fallbacks are legit (slide shows the bare URL, or image-only video links).
- Verified headless: slide-80 lightbox = 11 links, Vandana modal+lightbox = the video link, no 404s/console errors.

## 2026-06-17 — Links extraction, full content, gallery, slide JPGs

**User:** "do the rest of them" (populate all sections); rename "view original slide" → "More…"; clicking the image should open the original slide; add an "all slides at once" view; for deployment save slides as JPG quality 9. **Then, mid-work, a key catch:** the slides are full of hyperlinks we'd lose by dumping images — "stop and think about this."

**Response:**
- **Pivoted to preserve links (the crown jewels).** The deck has **184 hyperlinks across 78 slides** — it's a teacher *resource directory*. Rendering to flat images would discard them. Extended `scripts/build-images.js` to parse each slide's `<a:hlinkClick>` runs + hyperlink rels → `{text, url}` per slide, attached to the mapped resource. Result: **67 resources now carry real links (141 total)**. Side benefit: since links are preserved as text, the slide image can be low-quality.
- **Full content.** Expanded `js/data.js` from 53 → **102 resources** covering every section (Beloved Community, Brave Voices, Anti-Racist/CRT, Ethnic Studies, Play, Media Literacy, Design Thinking, Activism, Youth Voice, Abolition, Arts Integration, Gender/Banned Books, Scorecard, Resources). No dupe ids.
- **Re-ran mapping over all 102:** 76 mapped, 67 with links, 47 with covers, 2 low-confidence.
- **UI:** modal now shows "Resources & links from this slide" (clickable), a 🔗 count badge on cards, "More… (slide #N)" button (renamed), and clicking the cover opens a **slide lightbox** (←/→/Esc). New **`slides.html` gallery** — all 133 slides as a grid → lightbox; "All Slides" nav link added. Lightbox/gallery logic moved above the library guard in `main.js` so the gallery page gets it.
- **Deployment slide JPGs:** all 133 rendered slides → `assets/slides/slide-NNN.jpg` at **quality 9** (~21 KB each, **3.1 MB total** vs ~36 MB PNG). Showed Nick a q9/q40/q80 comparison; q9 kept (legible, links preserved separately). Covers also forced to JPG q82 ≤800px → `assets/img` 20 MB → 3.3 MB. Total deployable assets ~6.3 MB.
- `images.js` now exports `CT_MEDIA` (links + cover + slideNum) and `CT_SLIDE_COUNT`. Removed orphaned hand-mapped covers. Verified all three pages headless: no 404s, no console errors.

**Deferred:** copyright pass on third-party images; `lens-to-mirror` + one other left low-confidence/unmapped.

## 2026-06-17 — Auto image-mapping pipeline (slide → card)

**User:** "go ahead with what you think is best" (build the mapping script); also "don't worry about copyright stuff yet."

**Response:** Built `scripts/build-images.js` — deterministic, source-of-truth = the pptx XML, not eyeballing:
- Parses presentation order (sldIdLst → rels) so each `slideN.xml` maps to its rendered PNG page.
- Builds a slide inventory: text (`<a:t>`) + embedded image rels per slide.
- Matches each resource → its slide. Strong key = a **verbatim voice name** on the slide; weaker = token overlap. Only **high-confidence** matches commit (no silent wrong covers).
- Picks a cover = most prominent *content* image on the slide. Key fixes after first run:
  - **Logo leak:** Google numbers each slide's logo copy differently, so filename-frequency missed it. Switched to **content-hash (md5)** dedupe → any image content on ≥3 slides = chrome, excluded.
  - **Banners:** aspect-ratio filter (0.5–2.2) drops wide text bars.
  - **Author over-match:** dropped "Nicole Sumner" from voice matching; skip cover/intro/contents (pages ≤4).
  - **Text screenshots:** eye-verified the committed set; 4 were text/quote graphics → `COVER_EXCLUDE` (three-universal-points, microaggressions-nadal, disclaimers-disney-wb, sfsu-first-departments).
- Outputs: `assets/img/auto/<id>.<ext>` (21 covers), `assets/slides/<id>.png` (21 originals), `js/images.js` (`window.CT_IMAGES`), `scripts/mapping-report.json` (full audit incl. misses + low-confidence).
- Wired into UI: cards/modal read covers from `CT_IMAGES`; modal gained a cyan **"View the original slide (#N)"** button. `data.js` hand-set image fields removed → `images.js` is the single source. `data.js` now dual-exports (browser + Node).
- **Result: 21/53 cards have verified photo/art covers**; rest stay text where the slide had no usable photo. Notably the script corrected my earlier eyeball error (Siara Edmond → deck's real slide-12 `image26`, not `image17`). Verified via headless Chromium: 21 covers render, slide-link present, no console errors.

**Deferred:** copyright review of third-party images (user said not yet). `lens-to-mirror` left low-confidence/unmapped.

## 2026-06-17 — Visual direction locked: her BOLD look + image extraction

**User:** Asked how we'd actually get her graphics in; then, on sequencing, agreed to lock visual direction before building the image-mapping script; then chose **"go with her bold look."**

**Response:**
- **Image extraction proven.** Pulled the deck's real assets via Google export endpoints: `/export/pptx` → unzipped → 140 media files (82 PNG + 58 JPG, 125 MB); `/export/pdf` → `pdftoppm` → 133 slide PNGs. Heavy `assets/_extract/` left locally, gitignored.
- **Wired a real image demo** (view-verified each mapping; image9 was a locust, not the Truth Mandala bowl — caught before mapping): Vandana Shiva, Sadhguru, youth poet, and the intersectionality wheel now have photo covers via a new `image` field on those resources; cards + modal render covers. Her ARTWAYS/PLAYWAYS logo (image14) is in the nav. Optimized copies in `assets/img/`.
- **Recast the whole site to her bold identity**, drawn from the title slide: red/black/cyan/orange palette, Archivo (heavy poster sans) + Permanent Marker (hand accent) + Inter (body). Hero = stacked red+black title bars with cyan marker "Courageous" + rotated cyan in-progress sticky note. Components got chunky black borders + hard offset shadows. Punched up TYPES and TOPICS colors to the bold family. Executed crisp, not a literal PowerPoint copy.
- Verified via headless Chromium; screenshots reviewed and removed.

**Decided:** direction = her bold look; sequence = direction first, then mapping script.
**Next:** build the slide→card image-mapping script (parse each `slideN.xml.rels`, join to extracted text) — favored approach now is slide-as-image given the bold direction; revisit copyright on third-party images before any public launch.

## 2026-06-17 — Initial prototype from the slideshow

**User:** "Review these documents and suggest a way to make a cool website out of them" (link to the *Resources for Courageous Teachers* Google Slides deck), "Take some inspiration from what I did for ~/Developer/elleniya".

**Response:**
- Extracted the full 120-slide deck via the Google Slides `/export/txt` endpoint and read all ~1,280 lines. It's an in-progress K–12 teacher resource library by Mx. Nicole Sumner (CSUEB), organized into ~16 thematic sections with a built-in color key (Topic / Subcategory / Activity / Thinking Routine / Resource).
- Studied `~/Developer/elleniya` for design + stack inspiration: palette-from-source, Poiret One/Raleway pairing, immersive hero slideshow, lightbox, and a passwordless magic-link PHP/MariaDB CMS on Linode/Cloudflare.
- **Core reframe proposed:** the deck is linear but the content is a non-linear, browsable, searchable library → turn each slide into a tagged, filterable, deep-linkable resource card.
- Asked two scoping questions. User chose **"static now, CMS later"** for stack and **"build a clickable prototype"** for the next step.
- Built the prototype:
  - `js/data.js` — CMS-ready content model (TOPICS, TYPES, GRADES, RESOURCES). Pain & Bravery fully populated; ~30 more cards seeded across topics. 53 resources total. Plus hero quotes and intro questions.
  - `css/style.css` — warm activist palette (paper/ink/clay/indigo/gold/sage), Fraunces + Inter, grain texture, all components.
  - `index.html` — rotating quote hero, intro-questions grid, 16-topic grid with live counts, feature teasers (Spectrum of Action, Scorecard, Voices index), land-acknowledgement footer.
  - `resources.html` — sticky toolbar with search + type/topic/grade filter chips, card grid, detail modal.
  - `js/main.js` — hero rotation, topic grid, live filtering/search, `#topic/<id>` and `#r/<id>` deep links, modal.
- Verified with headless Chromium (Playwright, Python — no osascript): all views render, type filter narrows 53→9 Activities, modal opens and deep-links. Screenshots reviewed, then artifacts removed.
- Added README.md and this history.md.

**Open / next:** wire the Spectrum of Action and Curriculum Scorecard interactives; build the Voices index; decide hosting; later add the PHP/MariaDB magic-link CMS so Nicole can keep editing.

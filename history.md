# Courageous Teachers — History

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

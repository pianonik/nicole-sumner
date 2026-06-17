# Resources for Courageous Teachers

A living, searchable web library reimagining Mx. Nicole Sumner's *"Resources for Courageous Teachers"* slideshow (CSUEB Teacher Education) — activist practices, arts integration & play for K–12 educators.

**The core idea:** the original 120-slide deck is linear, but its content is a non-linear, browsable resource library. This site turns each slide into a **tagged, filterable, deep-linkable resource card** so a teacher can find the right activity, routine, quote, or reading in seconds.

Design and stack take inspiration from `~/Developer/elleniya` (palette-from-source, a distinctive display+body type pairing, an immersive quote-driven hero, and a planned passwordless CMS).

**Visual direction (locked): her own bold identity** — red / black / cyan / orange, hand-lettered accents, activist-poster energy, drawn straight from her title slide (stacked red+black title bars, cyan "in-progress" sticky note, the ARTWAYS/PLAYWAYS logo). Fonts: Archivo (heavy poster sans) + Permanent Marker (hand accent) + Inter (body). Executed crisp, not a literal copy of the deck.

## Status

**Prototype — static, content-first.** Plan is *static now, CMS later*: nail the design and information architecture as a static site, then add the PHP/MariaDB magic-link CMS (mirroring elleniya) once content settles so Nicole can keep adding resources herself.

## Stack

- Plain HTML + CSS + vanilla JS — no build step, no dependencies.
- All content lives in `js/data.js` as structured objects. This is deliberately the same shape a future `resources` database table would have, so the CMS step is a drop-in: replace `data.js` with a generated JSON feed, no markup changes.
- Fonts: **Fraunces** (display) + **Inter** (body), via Google Fonts.

## Structure

```
nicole-sumner/
├── index.html        # Landing: quote hero, intro questions, 16-topic grid, feature teasers
├── resources.html    # The Library: search + type/topic/grade filters, card grid, detail modal
├── css/style.css     # Bold palette (red/black/cyan/orange), all components
├── js/
│   ├── data.js       # TOPICS, TYPES, GRADES, RESOURCES (CMS-ready) + hero quotes
│   │                 #   (dual-export: browser window.CT + Node module.exports)
│   ├── images.js     # AUTO-GENERATED: window.CT_IMAGES (resource id -> cover + original slide)
│   └── main.js       # Hero rotation, topic grid, filtering, search, deep links, modal
├── scripts/
│   └── build-images.js  # Maps each resource to its source slide from the pptx XML,
│                        #   extracts a cover image + the rendered original slide
└── assets/
    ├── img/
    │   ├── logo.png      # her ARTWAYS/PLAYWAYS logo (nav)
    │   └── auto/         # GENERATED cover images, one per mapped resource
    └── slides/           # GENERATED rendered "original slide" per mapped resource
```

## Media pipeline (links + covers + slides)

The deck is not just slides — it's a **resource directory**: 184 hyperlinks across 78 slides. Those links are the most valuable thing in it, so the pipeline preserves them as real text, never bakes them into images.

Everything is mapped **deterministically from the pptx XML**, not by eye:

1. The deck is downloaded once via Google export endpoints — `/export/pptx` (unzipped: 140 media files) and `/export/pdf` (→ `pdftoppm` → 133 slide PNGs). This bulk lives in `assets/_extract/` (gitignored).
2. `node scripts/build-images.js`:
   - Parses each slide's text, embedded-image relationships, **and hyperlinks** (`<a:hlinkClick>` runs + hyperlink rels → `{text, url}`).
   - Matches every resource to its source slide (strongest signal = a cited **voice name** appearing verbatim; fallback = token overlap). High-confidence only.
   - Extracts the most prominent *content* image as a cover (logos detected by **content hash** and excluded; banners filtered by aspect ratio; verified text/quote screenshots in `COVER_EXCLUDE`). Covers are JPG, ≤800px.
   - Converts **all 133 slides** to `assets/slides/slide-NNN.jpg` at `SLIDE_JPG_QUALITY` (currently **9** — ~3 MB total; fine because the links are preserved separately).
   - Writes `js/images.js` (`window.CT_MEDIA` = links + cover + slideNum, and `CT_SLIDE_COUNT`) and `scripts/mapping-report.json` (full audit).
3. The UI reads `CT_SLIDE_LINKS` (per-slide) and `CT_MEDIA` (per-resource): cards show the cover + a 🔗 link-count badge; the modal lists the slide's links as clickable items; a "More…" button / clickable cover opens the original slide in a lightbox **that shows that slide's links beside the image**. `slides.html` is a gallery of all 133 slides → same lightbox.

Coverage: **all 148 links across 77 slides** are captured per-slide, so every link is clickable from the All Slides gallery — even on slides that didn't map to a resource (nothing is lost). 76 of 102 resources additionally map to a slide (47 with a cover). Re-run the script anytime resources change.

> Copyright: many images are third-party (portraits, news photos). Fine for review; a licensing/credit pass is needed before any public launch. (Deferred for now.)

## Content model

Each resource is tagged with:

- **Topic** — one of 16 threads (Pain & Bravery, Beloved Community, Anti-Racist Practice & CRT, Ethnic Studies, Play & Inquiry, …).
- **Type** — echoes Nicole's own color key: Activity · Thinking Routine · Resource, plus Quote · Concept · Definition · Media.
- **Grade band** — Early Childhood · K–5 · 6–8 · 9–12 · Higher Ed (or "all").
- **Voices** — the people cited (powers search and a planned Voices index).

The **Pain & Bravery** section is fully populated as the reference section; ~30 more cards are seeded across the other topics so filtering and search are live. Total: 53 resources.

## Deep links

- `resources.html#topic/<topic-id>` opens the library pre-filtered to a topic (topic cards on the homepage use this).
- `resources.html#r/<resource-id>` opens a specific resource's detail modal — shareable/bookmarkable, the thing a slideshow can't do.

## Planned (teased in the UI)

- **Spectrum of Action** — interactive self-locating slider (the deck already has the spectrum).
- **Curriculum Scorecard** — the Culturally Responsive Curriculum Scorecard as a live scoring tool.
- **Voices Index** — browsable wall of cited activists/artists/scholars → their resources.
- **PHP/MariaDB magic-link CMS** — so the "in-progress" library stays editable without redeploys.

## Local preview

Any static server works, e.g.:

```
python3 -m http.server 8731
```

then open <http://127.0.0.1:8731/index.html>.

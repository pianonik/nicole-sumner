'use strict';
/* ============================================================
   link-fixups.js  —  deterministic, no-judgment URL corrections
   applied at build time to links pulled straight from the deck.

   Use this ONLY for mechanical fixes: a site moved or renamed its
   address but the linked content is identical. Anything that needs
   an editorial choice (which replacement to use, whether to drop a
   link) belongs in Nicole's slides instead — see docs/dead-links.md.

   Required by both build-images.js and build-slides-html.js so the
   same correction reaches the inline slide links AND the per-slide
   link map. Keep this list short and obvious.
   ============================================================ */

const RULES = [
  // Harvard Project Zero retired the "www." host. http://www.pz.harvard.edu/<path>
  // now 404s, but https://pz.harvard.edu/<path> serves the exact same page.
  // Covers all 8 Project Zero links in the deck (slides 18, 62, 66, 82, 124, 125).
  {
    test: /^https?:\/\/www\.pz\.harvard\.edu\//i,
    fix:  u => u.replace(/^https?:\/\/www\.pz\.harvard\.edu\//i, 'https://pz.harvard.edu/'),
  },
];

function fixLink(url) {
  if (!url) return url;
  for (const r of RULES) if (r.test.test(url)) return r.fix(url);
  return url;
}

module.exports = { fixLink };

# Cadence product site

This public repository contains the static product site and public release assets for Cadence.

The application source remains in a separate private repository. Changes pushed to main deploy through GitHub Pages.

Cadence 1.9.0 shipped on November 12, 2026. The site links to the desktop and Android downloads, and the getting-started guide covers Overview, Syllables and the metronome. All four versioned links passed before deployment. The live site passed at four widths, and all 21 tests passed on the merged commit. [Release downloads](https://github.com/Insider-Trading/cadence-site/releases/tag/v1.9.0) · [Pages deployment](https://github.com/Insider-Trading/cadence-site/actions/runs/43252324454)

For the next release, keep the site PR in draft until the release is public and its versioned links return HTTP 200 to HEAD requests. Mark it ready for review, then wait for the owner's approval to merge.

Run the content and contrast checks with `node --test tests/*.test.mjs`.

# Cadence product site

This public repository contains the static product site and public release assets for Cadence.

The application source remains in a separate private repository. Changes pushed to `main` deploy through GitHub Pages.

The 1.6 redesign is live, with a split opening and the owner's verse, desktop/Android layout illustrations, rhyme examples, Rhyme Lab, Share Studio, setup guidance and platform downloads. Links target the verified 1.6.1 Windows installer, 1.6.0 production Android APK and their checksums. Release assets were published and checked before deployment.

The social preview is `assets/cadence-1-6-social.png`, rendered from the same hero text and highlighting. Design decisions are in `docs/SITE_1_6_DESIGN.md`; completed checks and remaining publication gates are in `docs/SITE_1_6_READINESS.md`.

Site: <https://insider-trading.github.io/cadence-site/>

## Local preview

Serve this directory with any static file server, or open `index.html` directly.

The page uses static HTML/CSS. JavaScript enhances the mobile menu, opens linked help answers and controls the colored atmosphere. Navigation, help and static colored backgrounds remain usable without JavaScript. The footer animation control remembers an explicit pause; system reduced-motion preferences take priority. See `docs/SITE_ATMOSPHERE.md` for the treatment and checks.

## Checks

Run `node --test tests/site.test.mjs` and `git diff --check`.

For browser checks, make the `playwright` package available and install Chrome, then run `node tests/browser-check.mjs`. If Playwright is outside this repository, set `PLAYWRIGHT_MODULE` to its absolute `index.mjs` path. The check uses an isolated headless Chrome session and temporary loopback server; screenshots go into ignored `.superpowers/qa/`.

Run `node scripts/render-social.mjs` with the same Playwright setup after changing the hero or release label. It generates the 1200 × 630 social image directly from the page. Inspect that image before publishing.

## Lyric preview fidelity

The editor and Share Studio examples use the owner's supplied lyrics verbatim. Do not rewrite their wording or punctuation when updating the site.

The main verse highlights were checked against the 1.6.0 Cadence engine source with the loaded CMU dictionary, Loose strictness, song-wide families, the default Cadence palette, and no learned pronunciations or manual overrides. It produces 19 highlighted words, four families, and 76% word-based density. The desktop/phone replicas and family legend use that output. Product illustrations use the app's default 0.13 highlight wash and layout-neutral marks; the large opening uses the same text colors without the wash.

Share Studio retains the source verse's violet family for `Write`, `recite`, and `revise`; connective words remain uncolored. The correction excerpt uses `Shift the stress, trim excess` with the same cyan and orange families. The separate word-demo cards and Rhyme Lab example remain unchanged by owner request. Different pronunciation packs, strictness, or saved family choices can produce different app results.

The Rhyme Lab scores are explicitly illustrative, not measured engine output. The product frames are labelled layout illustrations, not screenshots. Keep private writing and account details out of public assets.

# Cadence product site

This public repository contains the static product site and public release assets for Cadence.

The application source remains in a separate private repository. Changes pushed to `main` deploy through GitHub Pages.

The 1.7 update points to the verified public release and updates storage/sync guidance, the release label and social image. All 19 public release files passed anonymous download and hash checks before this site update. See [1.7 acceptance](docs/SITE_1_7_READINESS.md).

The site retains the 1.6 redesign, with a split opening and the owner's verse, current desktop/phone frontend captures, rhyme examples, Rhyme Lab, Share Studio, setup guidance and platform downloads. Links target the verified 1.7.0 Windows installer, production Android APK and checksums. Release assets were published and checked before deployment.

The social preview is `assets/cadence-1-7-social.png`, rendered from the same hero text and highlighting. Design decisions are in `docs/SITE_1_6_DESIGN.md`; completed checks and remaining publication gates are in `docs/SITE_1_6_READINESS.md`.

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

The main verse highlights were checked against the Cadence engine with the loaded CMU dictionary, Loose strictness, song-wide families, the default Cadence palette, and no learned pronunciations or manual overrides. It produces 19 highlighted words, four families, and 76% word-based density. The desktop and phone editor images are rendered from the current app frontend with that verse, standard interface size and a 24px editor font. They use the app's default 0.13 highlight wash; the large opening uses the same text colors without the wash.

Share Studio retains the source verse's violet family for `Write`, `recite`, and `revise`; connective words remain uncolored. The correction excerpt uses `Shift the stress, trim excess` with the same cyan and orange families. The word examples and the `crazy broke` Lab query are retained. Their surrounding controls now follow the app's current components. Different pronunciation packs, strictness, or saved family choices can produce different app results.

Lab scores are measured with Broad matching, balanced ranking, the default dictionary, no proper names and Deep cuts off: maybe 80, baby 80, wavy 92, both 73, bro 77 and smoke 100. The Lab capture keeps the actual result order and shows maybe/both in the combination builder. Backup, correction, Lab and Share Studio are captures of the 1.7 components. Backup uses an explicitly labeled synthetic connection with external requests blocked; no Google account was connected. Share Studio renders the separate approved eight-word phrase and explicitly retains its violet family through the supported export palette. The editor images show the shared app frontend at desktop and phone widths; they do not claim an operating-system capture. Keep private writing and account details out of public assets.

The September 20 display refresh also replaces the 1.6 editor assets on the page and rewrites the explanatory copy in the owner's voice. It leaves the owner lyrics, About copy and released installers unchanged. The in-app changelog source is updated separately for the next app build.

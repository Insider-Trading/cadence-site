# Cadence 1.6 site readiness

Released September 13, 2026. The owner-approved B layout with A's split opening is live. PR12 deployed as `a436c8a` through successful Pages run 34759705580 after the public 1.6.0 release passed verification.

All 19 public release files were downloaded anonymously and matched their checksums; all nine updater targets and the latest endpoint pass. The live HTML, CSS, JavaScript and image bytes match the approved source. Live 360/1440px checks pass for links, layout, menu dismissal and the 19 owner-verse marks. Earlier local checks cover 820/390px and JavaScript-disabled navigation. Previous releases remain available. Google Play and optional broader device testing are later work. The preparation checklist below is historical, not an open release blocker.

Publication preparation: the owner has now authorized release and deployment. All app platform builds and 18 staged asset checks passed. The page's labels, Windows/APK/checksum links and installation instructions now target 1.6.0. Six content tests and the browser matrix at 360/390/820/1440px pass, including JavaScript-disabled navigation. Social image regenerated and visually checked; supplied lyrics and all 19 main-verse marks remain unchanged. Merge only after the complete public release passes download verification. Earlier pending items below are historical where this checkpoint supersedes them.

## Completed

- Approved layout implemented in static HTML/CSS, with no framework, tracking or live account connection.
- Owner's verse and share line preserved exactly. A fresh check against the private app's 1.6 engine passed: 19 main-verse marks, four families, 76% density; share and correction excerpts, family legend and both product replicas agree.
- Copy uses the approved direct voice. Existing word examples and the Rhyme Lab example are retained as requested. Lab scores and simplified product frames are labelled illustrative.
- Site setup guide covers local storage, Drive, conflicts, Android installation, Windows publisher warnings and the no-AI/no-subscription policy. The matching five-page in-app tutorial is implemented and verified on final production Android and installed Windows candidates.
- Six source/content tests pass. Headless Chrome passes at 360, 390, 820 and 1440 pixels: no horizontal overflow, visible chosen sections, menu dismissal, keyboard focus, 44px interactive targets and local resources.
- JavaScript-disabled phone check passes for navigation, verse and native help disclosures. Reduced-motion mode is covered in browser checks. Desktop, phone and social-image captures were visually inspected.
- New 1200 × 630 social image rendered from the same page and checked for text clipping.
- Current Windows installer and checksum URLs verified against the public v1.5.1 release asset list. Other desktop platforms link to that release. No unverified 1.6 download URL is present.

Reproduce the public checks with the commands in the README. Browser captures stay in ignored local QA storage. Engine verification uses the private app source; do not copy that source, account data or private paths into this public repository.

## Remaining before publication

1. The app release workflow's production Android signing path is configured and locally verified. Complete its first authorized hosted cross-platform staging run. Local production Android and Windows 1.5.1 to 1.6.0 upgrades, preservation, installer signature and checksum checks now pass. Public updater verification follows publication. Package 6 engineering acceptance is already closed; do not reopen it for this site work.
2. Keep release notes and the app checklist aligned with the verified candidates. Final physical Android tutorial, installed Windows replay/first-run marker behavior and repaired Share Studio pass; do not describe that as a clean-machine install or a live release.
3. Capture any final release-candidate app media using sample writing only. Replace simplified frames where needed; keep illustrations labelled if retained. Do not describe these frames as tested app screenshots.
4. Once verified files exist, change preview labels, download URLs, platform versions, metadata and setup wording together. Update the release-boundary tests intentionally, regenerate the social image, and rerun content/browser/link checks. Confirm each download's checksum.
5. Publish the app release and deploy the approved site to main in the authorized release sequence. Check the live page, installer/APK downloads, checksums and updater metadata afterward. Keep previous releases for rollback.

Google Play submission is not part of this direct-APK release. Do not imply store availability.

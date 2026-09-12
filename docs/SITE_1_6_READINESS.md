# Cadence 1.6 site readiness

Updated September 12, 2026. The owner approved B's product-focused page with A's split opening. This branch is the implementation, not a live deployment.

## Completed

- Approved layout implemented in static HTML/CSS, with no framework, tracking or live account connection.
- Owner's verse and share line preserved exactly. A fresh check against the private app's 1.6 engine passed: 19 main-verse marks, four families, 76% density; share and correction excerpts, family legend and both product replicas agree.
- Copy uses the approved direct voice. Existing word examples and the Rhyme Lab example are retained as requested. Lab scores and simplified product frames are labelled illustrative.
- Site setup guide covers local storage, Drive, conflicts, Android installation, Windows publisher warnings and the no-AI/no-subscription policy. This does not replace the pending in-app tutorial work.
- Six source/content tests pass. Headless Chrome passes at 360, 390, 820 and 1440 pixels: no horizontal overflow, visible chosen sections, menu dismissal, keyboard focus, 44px interactive targets and local resources.
- JavaScript-disabled phone check passes for navigation, verse and native help disclosures. Reduced-motion mode is covered in browser checks. Desktop, phone and social-image captures were visually inspected.
- New 1200 × 630 social image rendered from the same page and checked for text clipping.
- Current Windows installer and checksum URLs verified against the public v1.5.1 release asset list. Other desktop platforms link to that release. No unverified 1.6 download URL is present.

Reproduce the public checks with the commands in the README. Browser captures stay in ignored local QA storage. Engine verification uses the private app source; do not copy that source, account data or private paths into this public repository.

## Remaining before publication

1. Complete the app's 1.6 release gates: genuine Android version upgrade, Windows installer/updater validation and final signed artifact checks. Package 6 engineering acceptance is already closed; do not reopen it for this site work.
2. Update and verify the in-app tutorial for Android and desktop. Reconcile release notes and the app's release checklist with actual artifact results.
3. Capture any final release-candidate app media using sample writing only. Replace simplified frames where needed; keep illustrations labelled if retained. Do not describe these frames as tested app screenshots.
4. Once verified files exist, change preview labels, download URLs, platform versions, metadata and setup wording together. Update the release-boundary tests intentionally, regenerate the social image, and rerun content/browser/link checks. Confirm each download's checksum.
5. Publish the app release and deploy the approved site to main in the authorized release sequence. Check the live page, installer/APK downloads, checksums and updater metadata afterward. Keep previous releases for rollback.

Google Play submission is not part of this direct-APK release. Do not imply store availability.

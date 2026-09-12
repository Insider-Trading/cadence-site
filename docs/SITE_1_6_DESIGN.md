# Cadence 1.6 site design

## Chosen direction

The owner selected the product-focused B direction with A's split opening: headline, explanation and download actions on the left; the owner's highlighted verse on the right, separated by a thin vertical rule. Below it, retain B's larger desktop-and-phone app demonstration and product sections. Stack the opening on narrow screens without clipping the verse or reducing it to a scaled desktop image.

## Visual identity

Use Cadence's existing Newsreader writing/display type and Space Grotesk interface type. Keep the near-black background, soft white text and restrained gray surfaces. Cyan, orange, pink and violet communicate actual rhyme families. Preserve the existing multicolor Cadence mark. Prioritize readable text, consistent spacing and accurate product depictions over ambient glows or decorative motion.

Palette: ink `#0b0d10`, surface `#13171c`, primary text `#edeef0`, secondary text `#a3abb5`, divider `#2b3038`, light action surface `#eeeae2`. Rhyme colors remain the app's palette, not newly selected brand accents.

## Page structure

1. Navigation and a visible download action.
2. Split opening with the existing headline "See your rhyme schemes.", concise product explanation, release notice and the owner's verse.
3. Desktop-and-Android product demonstration, followed by the standing no-AI, free-access and local-file promises.
4. The 1.6 Android Google Drive story: backup pace, Download changes, conflict review and direct APK installation.
5. Rhyme Lab, Notes/Board and Share Studio, using specific descriptions and accurate examples.
6. Verified platform downloads, installation and update guidance, release notes and support links.
7. Personal footer identifying INSIDER.

The preview's simplified app frames are layout illustrations, not claimed screenshots of the release candidate. Final media must use accurate release-candidate layouts and sample writing only. Do not publish personal account information or vault contents.

## Copy and example invariants

- Use the owner's approved site/About voice as the writing reference, without editing the app's About text.
- Avoid vague slogans, invented personal anecdotes, fake company language and motivational filler. Feature headings can simply name the feature.
- Preserve the owner's exact four-line verse, punctuation and logical line breaks. Share Studio uses "Write it then recite it then revise it" verbatim.
- Use actual engine output with a loaded CMU dictionary, default Loose strictness, song-wide families, no overrides and the default palette: 19 colored tokens, four families, 76% word-based density.
- Keep function words uncolored where the app does. Reused excerpts retain the source verse's family colors. Verify any future change against the engine rather than hand-picking matches.
- Keep the existing separate word examples and Rhyme Lab example by the owner's explicit choice. The correction excerpt is "Shift the stress, trim excess".
- Sync/recovery instructions state actual outcomes and choices neutrally. Google Play availability is not claimed.

## Implementation boundary

Keep the site static HTML/CSS with small progressive-enhancement scripts. Reuse the established site repository and hosting. Do not introduce a framework, account system, analytics service or live sync connection for this redesign. Download data must stay separate from preview copy so an unreleased candidate cannot accidentally become a public download target.

## Validation and release

- Check 390px phone, 820px tablet and 1440px desktop layouts, plus a 360px lower-bound pass before publication.
- Verify natural wrapping, readable contrast, keyboard focus, 44px minimum interactive targets and reduced-motion behavior. The site must remain usable without decorative animation.
- Preserve exact example text and verify token colors, family legend and displayed density together.
- Update tutorials, screenshots, platform descriptions and release notes to agree with the tested 1.6 build.
- Keep existing public download links until verified 1.6 artifacts exist. Preserve previous releases for rollback.
- The owner authorized publication once 1.6 is ready. Release only after Android version-upgrade, desktop installer/updater validation, final signed builds and the content/link checks pass. Then verify live downloads and checksums.

## Review status

The owner approved the combined layout direction. The updated combined preview and its revised copy are the next review artifact. This document records the design; it does not claim implementation or release validation is complete.

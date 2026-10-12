# Cadence website 1.8 interactive demonstrations

Approved direction: October 11, 2026. Keep the current identity and add working product samples with the application's springy motion. Publication remains separate.

## Working samples

The Notes sample supports opening and creating notes, editing titles and text, adding and removing tags, searching titles/text/tags, switching between writing and preview, and checking tasks in the preview. Returning to the library preserves changes. All changes remain in memory and reset on reload; the sample never touches application writing, settings, backups or online accounts. Preview renders text safely and supports headings and task lists. It is a bounded sample, not the full application editor.

The theme sample changes the actual rendered writing surface. Visitors can choose Cadence, Warm studio, Paper or Patterned, switch the writing font, and independently toggle rhyme colors and patterns. It uses application surface palettes and contrast-adjusted rhyme ink. The verse retains the owner's exact writing and its original 19 engine-derived marks/four families/76% coverage. This sample does not analyze new writing.

The earlier screenshot-switching implementation did not satisfy the approved interactive scope and has been replaced. Neither working sample contains an image or an image-opening link. Static, labeled captures remain available if JavaScript does not run. Other product screenshots elsewhere on the page still open at full size.

## Rhyme correction sample

The former three-column rhyme section now pairs one live verse with a correction panel. Selecting any of the 19 original highlighted words reveals its family and members. Visitors can move that word to another family or mark it as not a rhyme; word color, family membership and the correction count update together. Undo and Reset sample are reversible. The fixed starting analysis is copied from the canonical engine-derived hero. Corrections are local sample overrides, not fresh dictionary analysis or application settings. Original lyrics and logical line breaks remain unchanged.

At 720px and below, the same panel moves directly beneath the selected logical line. Resizing moves it back into the desktop side panel while preserving selection, corrections and keyboard focus. Words and controls have at least 44px targets. Escape returns focus from correction controls to the selected word. Shared motion moves the real panel and respects pause/reduced motion. Script-free visitors receive a text explanation, with no imitation buttons or screenshot link.

## Visual and motion identity

Keep Newsreader, Space Grotesk, charcoal and bone surfaces, and the application's family colors. Small controls have a light spring; writing surfaces move with more weight. Use the shared app spring, roughly 240ms control settling and 320ms surface entry, shortened by 20% on phones. Animate the real content being opened. Preserve immediate interaction and ordinary page scrolling. No autoplay, additional ambient loops, confetti or decorative page outlines.

Pausing or reducing motion settles running transitions. Controls continue to work without animation. Theme transitions affect only the sample. The site remains separate from the visitor's selected sample appearance.

## Verification

October 11 correction: ten automated tests pass for content, links, the exact verse, working-sample entry points, and contrast across the theme palettes. JavaScript syntax checks pass.

Browser interaction checks cover note creation and renaming, text editing, tag addition and searching, task changes reflected in source, return/reopen preservation, safe literal rendering of HTML-like input, real theme/font/pattern changes, and removal of image links from both interactive samples. Responsive review covers desktop, 320px and 390px phones, and 844 x 390 landscape with draft preservation across resizing. No horizontal overflow was found in the narrow sample editor. Script-free fixtures retain labeled captures. Instrumented fixtures confirm content animation normally, no further animation while paused, and zero animation calls under reduced motion.

A physical Pixel check creates a note and types its title through the real phone interface. The guarded device helper verifies display OFF afterward and temporary port forwarding is removed. No phone settings or application data were changed.

This is sample acceptance, not complete site release acceptance. Full-page enlarged text, broader browsers and the remaining 1.8 content refresh still precede publication.

## Remaining publication work

Refresh remaining product captures, setup guidance, page/social metadata and social image; finish navigation/disclosure polish after owner review. Public download activation follows separate application publication approval and independent asset verification. Draft PR19 remains unmerged until that gate passes. Staged download links are not public-release evidence.

## Rhyme correction verification, October 11

Fourteen content, contrast and correction-state tests pass. Browser checks verify reassignment, exclusion, Undo, Reset, exact verse preservation, 19 selectable words, no images in the section, keyboard activation/Escape, rapid selection and mobile panel placement. Desktop, 320px, 390px and 844 x 390 landscape retain the selected word and corrections without horizontal overflow; phone controls measure at least 44px. Normal motion runs, paused motion stops while selection still works, and the reduced-motion fixture records zero animation calls while corrections still apply. Script-free fallback remains readable. Physical Pixel taps verify reassignment and exclusion; display OFF is verified afterward and temporary forwarding removed. These checks cover this sample, not broader site release acceptance.


## Wording and independent appearance controls, October 11

Headings now name Notes, Themes, Rhyme highlights and Sync. Duplicate eyebrows, captions and selection narration are removed. The personal introduction and original verse are preserved. Free/offline/no-AI information appears once near the introduction. Each editable sample has one reset notice; useful screen-reader announcements remain. Use Font, Theme, Rhyme palette, Patterns and Sync consistently. Supporting text must explain a consequence, limitation, unfamiliar option or next step. Review whole rendered screens and remove redundant text before rewriting it. The application repository's docs/UI_WRITING.md records the permanent standard.

Theme, Rhyme palette and Patterns are independent. Three interface themes preserve font, palette, patterns and rhyme-color visibility. The three colorblind-friendly palettes use the application's values and existing contrast adjustment; selecting a palette does not enable patterns. Defaults remain Cadence, Newsreader, colors on and patterns off.

Seventeen automated tests pass. Browser review covers desktop, 320px, 390px, short landscape and enlarged text, plus editing, tags/checklists, rhyme corrections, independent appearance controls, focus, reduced motion and script-free fallbacks. Metadata and setup wording are refreshed. Remaining publication work is product/social capture refresh, broader-browser and navigation/disclosure acceptance, and separately authorized application publication with independent public-asset verification. No deployment was performed.


## Hero gutter refinement, October 12

Owner review removed the older vertical divider and multicolor strip beside the opening verse. A reserved number gutter with a 14px text gap now provides alignment on desktop and phones. This supersedes the 1.6 divider choice. Browser checks at 1440px, 390px and 320px confirm no horizontal overflow, consistent number spacing and working family selection. Verse text and highlighting are unchanged.

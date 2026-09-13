# Cadence color atmosphere

Prepared September 13, 2026. Awaiting the owner's local visual review before publication.

The existing layout now sits on charcoal (#08090b), with cyan/violet and orange/pink ambient light around its edges. Cyan returns to the opening headline, and all five Cadence colors appear in section markers and outer frames. Primary buttons retain their bone surfaces. Typography, copy, lyrics, illustrated app interiors and download destinations are preserved.

`atmosphere.css` adds the treatment after the original stylesheet. The two light fields alternate over 24 and 32 seconds. A fine pointer shifts the hero light by a maximum of 12px and lights the nearest part of a panel border. Pointer coordinates stay on the decorative element to avoid invalidating the page layout. Updates share one pending animation frame; bounds are cached until exit, scrolling or resizing.

The footer's Pause animation / Resume animation button remembers the choice in local storage when available. An explicit pause stops pointer reactions too. Reduced motion always stops movement and hides the control. Page visibility pauses movement without changing the stored preference. Touch keeps the colored background without pointer effects. Decorative layers are hidden from accessibility tools and cannot intercept clicks. Without JavaScript, the page retains static color and hides the animation control.

## Verification

- Six existing content tests pass, including the exact verse, all 19 hero highlights and desktop 1.6.1 / Android 1.6.0 links. The complete main HTML matches the preceding release after Git line-ending normalization; the original stylesheet is unchanged.
- Chrome checks pass at 360, 390, 820 and 1440px for overflow, navigation, keyboard access, 44px controls and resources. A JavaScript-disabled phone check covers navigation, verse, help and static atmosphere.
- Motion checks cover cycle timing, the 12px distance limit, border masking, pointer exit, one frame and one measurement for a 200-event burst, keyboard pause, reload persistence, live reduced-motion changes, touch and unavailable storage.
- The visibility handler passes a deterministic hidden/visible event check. The automation browser reported both actual tabs visible during tab switching, so that run does not establish native tab visibility behavior.
- A 720x500 CSS viewport at device scale 2 checks the layout equivalent of 200% zoom on a 1440x1000 display without horizontal overflow. This is an emulated zoom check, not a native browser zoom assertion.
- Sampled desktop hero/navigation text contrasts range from 7.38:1 to 16.09:1 against rendered static backgrounds. Desktop and phone captures were visually inspected.
- In a local Chrome profile, four seconds of ambient movement caused zero layouts and no JavaScript execution. A 120-event pointer sweep caused zero layouts and about 4ms total script time. These are local measurements, not a cross-device performance guarantee.

Run the checks using the commands in the README. Browser previews are saved in ignored `.superpowers/qa/`. This site change does not modify application binaries or updater metadata.

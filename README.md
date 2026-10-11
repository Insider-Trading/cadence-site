# Cadence product site

This public repository contains the static product site and public release assets for Cadence.

The application source remains in a separate private repository. Changes pushed to main deploy through GitHub Pages.

The 1.8.0 preparation branch updates downloads and adds working Notes and theme samples. Visitors can create and edit sample notes, try tags and checklists, and change the live writing sample's appearance. Changes reset on reload and never touch application data. See docs/SITE_1_8_DESIGN.md for scope, motion direction and remaining publication checks. Merge only after the owner approves publication and the public 1.8.0 assets have been independently verified.

Run the content and contrast checks with `node --test tests/site.test.mjs tests/demo-colors.test.mjs`.

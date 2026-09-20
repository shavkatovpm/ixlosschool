# TestGPT — Ixlos brand collection

Exactly six concepts are available. Rakurs and Kashfiyot retain their composition; the other eight former interfaces and their CSS are removed. Old or invalid design IDs resolve to Rakurs.

| ID | Direction | Composition |
| --- | --- | --- |
| rakurs | Retained, brand-aligned | Oversized asymmetric typography, rotated photograph, offset callout and curriculum |
| kashfiyot | Retained, brand-aligned | Playful bento, expressive headings, new green/gold 3D artwork |
| mozaika | New, modular bento | Large green type block, 3D tile, photo tile and club-count tile |
| lavha | New, minimal photographic editorial | Open typography and an unequal photographic triptych with a green interlude |
| ziyo | New, sculptural | Large annotated 3D centerpiece and a staggered learning path |
| soz | New, text-focused | Typographic manifesto, margin notes, curriculum ledger and a text-only school-day composition |

## Brand and implementation

- Primary green #175c2b comes from public/brand/ixlos-school.svg.
- Supporting colors: deep green, pale sage, warm ivory and restrained gold.
- Shared factual content stays in school-content.ts.
- The gallery uses separate shell styles, six accessible selector buttons, previous/next controls, keyboard navigation, URL selection and browser history.
- Existing club filters, FAQ and /uz#apply application links are preserved.
- Mobile navigation supports Escape and focus return; reduced-motion preferences are respected.
- Existing local photos are concept imagery, not verified photographs of the actual school.

## Generated asset

Built-in ImageGen was used, then the output was optimized with Sharp to a 1536 × 1024 WebP (147,646 bytes).

Final workspace path: public/testgpt/ixlos-learning-playground.webp.

Final generation prompt:

> Use case: stylized-concept. Asset type: premium private school website hero illustration, a real rendered bitmap asset, not a UI mockup. Create a beautifully art-directed sculptural 3D learning playground for Ixlos School. A large open ivory book is a physical landscape, one thick dark forest green book underneath, sculptural green stairs rise from its pages towards a small warm brushed-gold sphere, a single oversized forest green pencil leaning diagonally, a tiny gold chess knight and a clean thin green orbital loop linking the composition. Cohesive sophisticated museum-quality designer object, tactile matte lacquer and warm paper, playful geometry with academic dignity, not childish plastic. Palette strictly Ixlos brand green #175c2b, deep green #102f1c, pale sage #dde6d7, warm ivory #f5f3e9, small muted gold #c9a24b accents. Light warm ivory seamless studio background. Soft directional daylight from upper left, exquisite ambient shadows, realistic 3D materials, editorial product photography quality, three-quarter orthographic view. Landscape 3:2 image, composition centered with comfortable breathing room around all objects, fills 80 percent of frame. No letters, no text, no logo, no UI, no people, no watermarks, no purple, no red, no blue. Return the saved image file path.

## Validation

- Scoped ESLint, TypeScript and whitespace checks passed.
- Isolated Next.js production build of the TestGPT route passed.
- All five production routes returned 200 with exactly five design choices, one H1, unique IDs, required content sections and the existing application link.
- Removed and invalid design IDs rendered Rakurs; the generated image returned 200 as image/webp.
- Desktop screenshots of Mozaika and Ziyo were inspected. The artwork backdrop was softened based on this review.
- Responsive CSS is implemented for mobile/tablet/desktop. Native browser automation stopped returning DevTools state, so mobile visual QA could not be fully completed in this session.
- The rest of the project still has the previously observed unrelated /logo root-layout build issue; the route was validated in an isolated copy under /tmp without changing other routes.

## So‘z addition

`/testgpt?design=soz` adds a sixth, text-focused direction. Existing five concepts remain. It reuses the factual content and interactions, omits photographs and 3D assets, and includes dedicated mobile/tablet typography and layout rules. Gallery count now derives from the concepts array.

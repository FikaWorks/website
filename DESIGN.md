# FikaWorks website design language

The website follows the FikaWorks print leaflets: warm paper, soft stage
colours, rounded colour cards and headings with a thin rule. Use these building
blocks for new pages instead of inventing new styles. Everything named here
lives in `assets/css/main.css` (tokens in `@theme`, components in
`@layer components`).

## Layout

- **One content column.** Wrap each section's content in `page-container`
  (centred, 1280px wide, 40px side margins on tablet and up, 12px on phones).
  Section backgrounds can run edge to edge; content never does.
- **Grid.** Inside the container use
  `grid grid-cols-6 md:grid-cols-12 gap-6 lg:gap-10`. Full-width content is
  `col-span-full`; two-column layouts split the 12 columns (for example 1–7 and
  8–12). Text that runs long stays narrower (`max-w-3xl` or `lg:col-end-10`).
- **Spacing.** Content sections use `section-pad` (40px top and bottom, 56px on
  desktop). Page headers and the dark feature band keep their own.

## Colour

| Role                           | Token                                        | Value                |
| ------------------------------ | -------------------------------------------- | -------------------- |
| Paper (page background)        | `fika-offWhite`                              | `#fdfaf6`            |
| Assess / blue                  | `fika-soft-blue`                             | `#aab5d0`            |
| Build / yellow                 | `fika-soft-yellow`, card `fika-butter-light` | `#eee79f`, `#fefad8` |
| Run / green                    | `fika-soft-green`, card `fika-sage-light`    | `#99c69d`, `#b6ceb6` |
| Lead / lavender                | `fika-light-purple`                          | `#d4d1de`            |
| Accent text, links, checkmarks | `fika-purple`                                | `#6f84b5`            |

- The whole page is paper. Do not alternate white and beige bands. The only
  exceptions are the dark "How we're different" band and the black products
  band, used as deliberate statements.
- Stage colours always mean the same thing: Assess blue, Build yellow, Run
  green, Lead lavender. Elsewhere, rotate blue, yellow, green, lavender.
- No violet or orange.

## Type

- Font: Patron (Regular 400 and Medium 500). No light weight.
- Home title `text-5xl md:text-6xl lg:text-7xl`, page titles `lg:text-6xl`,
  section headings `text-3xl lg:text-heading` (44px), card titles
  `text-xl lg:text-2xl`, intro text `text-lg lg:text-xl`, body
  `text-base lg:text-lg`.
- Small uppercase labels above titles:
  `text-sm font-medium uppercase tracking-[0.15em]` (or `0.2em` in page
  headers).

## Components

- **Section heading with rule.** Add `title-rule` to a full-width section `h2`:
  a thin line runs from the heading to the right edge. Skip it when the heading
  wraps onto two lines or is centred.
- **Card.** `card` plus a tone (`tone-blue`, `tone-yellow`, `tone-green`,
  `tone-purple`, `tone-neutral`): rounded corners, filled with the tone, no
  border. Use it for every clickable or grouped block.
  - `card-badge`: a 56px circle in the tone's darker shade, holding an icon
    (`partial "icon.html" (dict "name" "stack-2" "class" "h-7 w-7")`).
  - `card-dot`: a smaller colour dot when there is no icon.
  - Size grids to their cards: 2 or 4 cards → two columns, 3 or 6 → three.
- **Numbered steps.** `ol.steps` with `li.tone-*` and a `span.step-num`: circles
  with the number, joined by a vertical line.
- **Colour dots.** Stage markers are filled dots
  (`rounded-full bg-fika-soft-blue`), never outline rings.
- **Page header.** `page-hero.html` with `decor-circles.html`: flat colour
  circles and thin outline circles bleeding off the corners.
- **Closing call to action.** `cta.html` / `cta-join.html`, built on
  `cta-panel.html`: a lavender card in the content column.
- **Header.** A white bar with a thin bottom border, like the other white
  surfaces (logo box, diagrams, previews, menu dropdowns).
- **Buttons.** Primary: black pill (`rounded-[40px] bg-black text-white`).
  Secondary: underlined text link.

## Icons

Outline icons from [Tabler Icons](https://tabler.io/icons) (MIT licence, see
`assets/icons/LICENSE`), drawn at 1.5px. To add one, download the outline SVG
into `assets/icons/` and render it with `partial "icon.html"`.

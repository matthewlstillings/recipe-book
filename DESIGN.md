# Recipe book design system

Locked Nov 10, 2026 from the "Styled mocks" page of the Recipe Book Paper Mocks canvas.
The look: everything sits on paper. A charcoal page holds light paper cards. No images, no animations.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--page` | `#2f2f2e` | Page background |
| `--page-raised` | `#3a3a38` | Search box fill |
| `--paper` | `#d6d3cc` | Cards, dialogs, light buttons |
| `--ink` | `#2b2a28` | Body text on paper, dark buttons |
| `--ink-strong` | `#1f1e1c` | Titles on paper |
| `--ink-muted` | `#54524d` | Labels and descriptions on paper |
| `--page-text` | `#e4e1da` | Body text on the page |
| `--page-title` | `#f0ede6` | Titles on the page |
| `--page-muted` | `#a9a69f` | Labels on the page |
| `--rule` | `#8a8780` | Rules and dividers |
| `--rule-soft` | `#54524d` | Rules between attempts on the page |
| `--stamp-not-baked` | `#9c3b26` | Not baked tag |
| `--stamp-baked` | `#2c6224` | Baked tag, Baked switch on |
| `--off` | `#6f6c66` | Switch off, empty rating segment |
| `--rating` | `#a85a1c` (edge `#8f4c14`) | Crowd rating segments, ingredient underline |
| `--highlight` | `#e8c766` | Search match, open ingredient |
| `--mention` | `#e2d6ae` | Ingredient mention in steps |
| `--popover` | `#2b2a28` / text `#f0ede6`, muted `#c9c6bf` | Quantity popover |

Grades (text is always `--ink`, every pair is at least 4.5:1):
A `#8cbf74`, B `#e8c766`, C `#f2a65a`, D `#ef8f5a`, F `#ec7a78`.

## Type

- **Inter** for UI text. Labels are 11 to 12px uppercase with 0.16em tracking and end in a colon ("Steps:").
- **Source Serif 4** (weight 400) for titles, quantities, grades and step numbers.
- Page h1: `clamp(44px, 8vw, 84px)`. Recipe h1: `clamp(19px, calc(7.2vw - 9px), 64px)`.
- Body 15px, line-height 1.55. Cook mode steps `clamp(18px, 2.2vw, 21px)`.

## Layout

- Page padding `20px clamp(16px, 5vw, 64px) 64px`, content max width 1240px.
- Cards: radius 10px, no shadow. The dialog is the only thing with a shadow.
- Grids reflow from 1 column (phone) to 2 (tablet) to 3 (desktop) with `auto-fill, minmax(min(100%, 300px), 1fr)`, so one or two cards keep their column width instead of stretching.
- Home: "Recently added" (the 3 newest recipes as list rows) on top, then categories. Categories with no recipes are hidden.
- A faint paper grain sits over the page at 9% opacity.

## Components

- **Search box:** pill, 44px tall, `--page-raised` fill with a 1.5px `--paper` border. On Home, Category and Search, never on Recipe or Cook mode.
- **Buttons:** pills, at least 44px tall. Dark (`--ink` fill) for the main action, outline for the rest.
- **Tag:** 9px uppercase stamp with a 1.5px border, rotated -2deg, placed above a recipe title in lists.
- **Rating:** five 22x10 segments, filled `--rating` up to the score.
- **Grade blob:** hand-drawn circle filled with the grade color, serif letter in the middle.
- **Baked switch:** 38x22, green when on. It is the only baked indicator on the Recipe page.
- **Ingredient mention:** tinted and underlined word in a step. Tapping it opens a dark popover with the amount for that step, scaled to the batch.
- **Focus ring:** 2px outline, 3px offset. `--highlight` on the page, `--ink` on paper.
- **Back navigation:** none on screen. The browser or phone back button does it.

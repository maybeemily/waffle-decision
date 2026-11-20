# Waffle Decision — plan

A frontend-only app that suggests waffle toppings. You pick categories and how many toppings you want, and the toppings appear as words on top of a drawn waffle.

## Decisions so far

| | |
|---|---|
| Stack | Vite + React + TypeScript, CSS Modules, Framer Motion |
| Data | `waffle-toppings.json`: 118 items (41 sweet, 37 savory, 40 silly), shape `{ id, name, tags[] }` |
| Categories | Checkboxes for sweet, silly and savory (any combination). "Surprise me" checks all three, and unchecking any one turns it off |
| Count | Slider from 1 to 8, default 3. At 8 the label reads "pile it on" |
| Waffle | Drawn with SVG, toppings shown as text |
| Hosting | GitHub Pages, deployed by GitHub Actions |
| Folder | `~/web-things/waffle-decision` |

## Architecture

```
waffle-decision/
  index.html
  vite.config.ts              # base: '/waffle-decision/' for GitHub Pages
  .github/workflows/deploy.yml
  src/
    main.tsx
    App.tsx                   # holds state: categories, count, current toppings
    App.module.css
    styles/tokens.css         # colors, fonts, spacing; a color per category
    data/
      waffle-toppings.json    # moved here from the folder root
    lib/
      types.ts                # Topping, Category
      pickToppings.ts         # pure selection logic (unit tested)
      layout.ts               # where each word sits on the waffle
    components/
      CategoryPicker/         # 4 checkboxes and the Surprise me sync logic
      CountSlider/            # 1–8 slider with the "pile it on" label
      Waffle/                 # SVG waffle with the word layer on top
      ToppingWord/            # one animated word
      DecideButton/           # "Decide" / "Again"
```

There is no backend and no router, so it is a single page. State lives in `App` with `useState`, and no state library is needed.

### Selection logic (`pickToppings.ts`)

- The pool is every topping whose `tags` include a selected category.
- For a single category, shuffle the pool (Fisher–Yates) and take N.
- For more than one category, or Surprise me, take toppings from each category in turn so the result is mixed. For example, 3 toppings with Surprise me gives one sweet, one savory and one silly, in random order.
- Pressing "Again" avoids repeating the previous set where the pool is big enough.
- The Decide button is disabled when no category is checked.
- `tags` is already an array, so a topping can later belong to more than one category without code changes.

### Waffle and word layout

- The waffle is an SVG: a rounded golden square with a 4×4 grid of inset pockets, shading and a small butter highlight. It is sized with CSS so it scales to fit a phone.
- The words sit in a positioned HTML layer on top of the SVG, not as SVG `<text>`, so they wrap, use web fonts and are easy to style.
- `layout.ts` has a hand-tuned set of non-overlapping positions for each count from 1 to 8. A little random rotation and offset makes each result look scattered instead of set on a grid.
- Each word is colored by its category, using a syrup tone for sweet, a herb tone for savory and a bright color for silly. The font size gets smaller as the count goes up.
- Animation: words drop onto the waffle one after another with a slight bounce, using Framer Motion. With `prefers-reduced-motion` they fade in instead.

### Accessibility

- The words are real DOM text. A visually hidden `aria-live` list reads out the result, for example "Your waffle: maple syrup, a rubber duck, feta".
- Checkboxes and the slider use native inputs with labels, and the slider's text value says "pile it on" at 8.

### Nice to have (later)

- A share link: encode the result in the URL (`?t=maple-syrup,feta,regret`) so a waffle can be sent to someone.
- A "copy my waffle" button.
- Lock a topping you like and reroll the rest.

## Execution

1. Scaffold the app: `npm create vite@latest` (react-ts), add Framer Motion, `git init`, and move the JSON into `src/data/`.
2. Write the types and `pickToppings`, plus Vitest unit tests for pool filtering, mixing, count clamping and no-repeat.
3. Build the controls: CategoryPicker with the Surprise me sync, CountSlider, DecideButton.
4. Draw the SVG waffle and set up the design tokens.
5. Build the word layer: layouts for 1–8, per-category styling, the drop-in animation.
6. Polish: responsive layout, reduced motion, favicon (a waffle), meta tags and an Open Graph image.
7. Deploy: set Vite's `base`, add the GitHub Pages Actions workflow, create the GitHub repo and push. The site goes live at `https://<username>.github.io/waffle-decision/`.
8. Portfolio: add a Waffle Decision entry to `portfolio/src/content/projects.ts` with `repo` and `demo` links.

## Open questions

- GitHub repo name and visibility (public is needed for free GitHub Pages on a personal account). Default: public `waffle-decision`.
- Look and feel: fonts and palette. Default: a warm diner-menu feel with a chunky serif display font.
- Optional: a custom domain or subdomain later, such as `waffles.<your-domain>`.

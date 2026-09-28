# NOUR — MY TRAINING ROUTINE

A premium, cinematic personal site that presents **my training routine**.

---

## Stack

- HTML5
- CSS3 (custom properties, no frameworks)
- Vanilla JavaScript (no dependencies, no build step)

Everything renders from data — nothing about the split is hardcoded in the markup.

---

## Structure

```
project/
├── index.html              Page structure (semantic, all sections)
│
├── css/
│   └── style.css           Theme, layout, components, animations, responsive
│
├── js/
│   ├── app.js              UI logic: nav, menu, rendering, modals, theme
│   ├── workouts.js         All workout data (the split + exercises)
│   └── config.js           Site name, social links, settings
│
├── assets/
│   ├── images/             hero.jpg, upper.jpg, lower.jpg, rest.jpg
│   │   └── exercises/      one thumbnail per exercise
│   ├── videos/             intro.mp4
│   │   └── exercises/      one short demo per exercise
│   ├── audio/
│   │   └── audio.mp3       (placeholder — currently unused by the UI)
│   └── favicon.png
│
└── README.md
```

---

## The split

```
DAY 01  UPPER
DAY 02  LOWER
DAY 03  UPPER
DAY 04  RECOVERY
```

Four days. Two upper. One lower. One recovery.

---

## Editing

### Change the routine

Everything lives in **`js/workouts.js`**. Each day is one object:

```js
{
  day: "DAY 01",
  type: "UPPER",
  title: "UPPER",
  image: "assets/images/upper.jpg",
  focus: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
  estTime: "60 - 90 Minutes",
  note: "Heavy barbell work first, then accessories.",
  exercises: [
    {
      name: "Bench Press",
      sets: 4,
      reps: "6 - 10",
      thumbnail: "assets/images/exercises/bench.jpg",
      video: "assets/videos/exercises/bench.mp4"
    }
  ]
}
```

- Add a day → the card builds itself.
- Add an exercise → the table row builds itself.
- The recovery day has **no** `exercises` array, so it renders the
  minimal recovery state instead of an exercise table:

```js
{
  day: "DAY 04",
  type: "RECOVERY",
  title: "RECOVERY",
  image: "assets/images/rest.jpg",
  focus: ["Mobility", "Stretching", "Light Cardio"],
  estTime: "As Needed",
  note: "No training today."
}
```

### Change the site

`js/config.js` controls the name, nav, social links, and behaviour
(theme, scroll reveal, lazy loading). No markup edits required.

### Swap in your own media

Replace the files under `assets/`. The placeholders are dark, red-lit
computer-generated renders — drop in real photos/clips at the same paths
and names and everything just works.

---

### External exercise clips

- `upper2-pull-ups.gif` and `upper2-barbell-row.gif`: FitnessScape,
  [Pull-ups](https://commons.wikimedia.org/wiki/File:Pull-ups_-_exercise_demonstration_video.webm)
  and [bent-over row](https://commons.wikimedia.org/wiki/File:Bent-over_row_-_exercise_demonstration_video.webm),
  licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

## What the JS does

`js/app.js` is organised into small modules:

| Module | Responsibility |
| --- | --- |
| `renderNav` | Builds desktop + mobile links from `CONFIG.nav` |
| `initScrollSpy` | Highlights the active section while scrolling |
| `initMobileMenu` | Animated full-screen menu, body scroll lock, focus handling |
| `renderSocials` | Social tiles in hero / footer / contact + mobile |
| `renderSplitCards` | Builds the day cards from `workouts[]` |
| `renderWorkoutInfo` | Left column: focus, time |
| `renderExercises` | Center column: the exercise table |
| `renderPreview` | Right column: cinematic exercise preview card |
| `setRecoveryMode` | Swaps the table/preview for the minimal recovery state |
| `initModals` | Intro + demo video modals, with a graceful placeholder |
| `initTheme` | Dark/light toggle, persisted to `localStorage` |
| `initReveal` | IntersectionObserver scroll reveals |

### Video fallback

When a video file is missing or fails to load, the modal shows a clean
**"VIDEO COMING SOON"** state instead of breaking — see `stageVideo()`.

---

## Accessibility

- Semantic landmarks, single `<h1>`, logical heading order
- Icon-only buttons carry `aria-label`s
- Cards are real `<button>`s with `aria-selected`
- Table rows are keyboard-activatable (`Enter` / `Space`)
- Modals trap focus on open and restore it on close
- `Escape` closes any open modal or the mobile menu
- Visible focus rings, `prefers-reduced-motion` support

---

## Performance

- No frameworks, no runtime, no build step
- Lazy-loaded imagery (`loading="lazy"`), hero uses `fetchpriority`
- GPU-friendly transforms for animation
- `passive` scroll listeners
- Videos load only when a modal opens (`preload="metadata"`)

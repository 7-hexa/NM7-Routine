/* =============================================================
   NOUR — MY TRAINING ROUTINE
   -------------------------------------------------------------
   Global site configuration. Edit anything here without
   touching the markup or the app logic.

   Everything the UI consumes is driven from this file, so the
   site is easy to wire up to a CMS / API / admin dashboard later.
   ============================================================= */

const CONFIG = {
  /* ---- Identity ------------------------------------------ */
  site: {
    name: "NOUR",
    signature: "Nour",
    tagline: "MY TRAINING ROUTINE",
    title: "NOUR — My Training Routine",
    description:
      "My personal training routine. Upper / Lower / Upper / Lower / Recovery.",
    url: "https://nour.example"
  },

  /* ---- Navigation ---------------------------------------- */
  nav: [
    { label: "HOME",           href: "#home" },
    { label: "TRAINING SYSTEM", href: "#split" },
    { label: "ABOUT",          href: "#about" },
    { label: "CONTACT",        href: "#contact" }
  ],

  /* ---- Social -------------------------------------------- */
  social: [
    { label: "Instagram", href: "https://www.instagram.com/_nour_eldin___?stkn=MTA4eHZmMmN2cnpmNA==", icon: "instagram" },
    { label: "TikTok",    href: "https://www.tiktok.com/@nour_mohamed_777?_r=1&_t=ZS-9A7NUpvRZwY",    icon: "tiktok" }
  ],

  /* ---- Behaviour ----------------------------------------- */
  settings: {
    defaultTheme: "dark",                 // "dark" | "light"
    respectSystemTheme: true,             // honour prefers-color-scheme on first visit
    scrollReveal: true,                   // sections fade in on scroll
    lazyLoad: true,                       // lazy-load imagery
    smoothScroll: true                    // in-page anchor smoothing
  },

  /* ---- Media --------------------------------------------- */
  assets: {
    introVideo: "assets/videos/intro.mp4",
    heroImage: "assets/images/hero.jpg",
    ambientAudio: "assets/audio/audio.mp3"
  },

  /* ---- Footer mantra ------------------------------------- */
  mantra: ["TRAIN", "IMPROVE", "REPEAT"]
};

/* Expose for the app (and any future tooling). */
window.CONFIG = CONFIG;

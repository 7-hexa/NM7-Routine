/* =============================================================
   NOUR — MY TRAINING ROUTINE
   -------------------------------------------------------------
   All workout data lives here. The UI is generated 100% from
   this array — nothing about the split is hardcoded in HTML.

   Structure per day:
     day        Small label shown on the card
     type       UPPER | LOWER | RECOVERY
     title      Large display title
     image      Background image for the card
     focus      Muscle groups / focus list
     estTime    Estimated session length
     note       Short one-liner for this day
     exercises  The list rendered in the details section
                (name / sets / reps / thumbnail / video)

   The split is always:
     DAY 01  UPPER
     DAY 02  LOWER
     DAY 03  UPPER
     DAY 04  RECOVERY

   A day without an "exercises" array (recovery) renders the
   minimal recovery state instead of an exercise table.

   To add an exercise, drop another object in the exercises array.
   To add a day, add another object and the card builds itself.
   ============================================================= */

const workouts = [
  {
    day: "DAY 01",
    type: "UPPER",
    title: "UPPER",
    image: "assets/images/exercises/bench.jpg",
    focus: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
    estTime: "60 - 90 Minutes",
    note: "Heavy barbell work first, then accessories.",
    exercises: [
      { name: "Lat Pulldown",            sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/bench.jpg",          gif: "assets/videos/exercises/lat-pulldown-web.gif" },
      { name: "Incline Chest — Dumbbell or Machine",            sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/barbell-row.jpg",     video: "assets/videos/exercises/barbell-row-web.mp4" },
      { name: "Seated Cable Row — One Arm",               sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/pullups.jpg",         video: "assets/videos/exercises/pullups-web-encoded.mp4" },
      { name: "Pec Deck ",         sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/lateral-raises.jpg",  gif: "assets/videos/exercises/Pec Deck.gif" },
      { name: "Front Shoulder",            sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/biceps-curl.jpg",     gif: "assets/videos/exercises/Front Shoulder.gif" },
      { name: "Triceps",       sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/triceps-pushdown.jpg", gif: "assets/videos/exercises/Triceps.gif" },
      { name: "Biceps",            sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/biceps-curl.jpg",     gif: "assets/videos/exercises/Biceps.gif" },
      { name: "Forearms",                sets: 2, reps: "12 - 15", thumbnail: "assets/images/exercises/lateral-raises.jpg",  gif: "assets/videos/exercises/Forearms.gif" },
    ]
  },

  {
    day: "DAY 02",
    type: "LOWER",
    title: "LOWER",
    image: "assets/images/exercises/squat.jpg",
    focus: ["Quads", "Hamstrings", "Glutes", "Calves"],
    estTime: "60 - 90 Minutes",
    note: "Squat-focused quad session.",
    exercises: [
      { name: "Deadlift",                sets:2, reps: "6 - 10",  thumbnail: "assets/images/exercises/squat.jpg",          gif: "assets/videos/exercises/Deadlift.gif" },
      { name: "Squat",    sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/rdl.jpg",            gif: "assets/videos/exercises/Squat.gif" },
      { name: "Leg Curl — Machine",            sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/leg-press.jpg",      gif: "assets/videos/exercises/Leg Curl — Machine.gif" },
      { name: "Leg Extension — Machine",        sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/leg-extension.jpg",  gif: "assets/videos/exercises/Leg Extension —Machine.gif" },
      { name: "Adductor Machine",             sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/leg-curl.jpg",       gif: "assets/videos/exercises/Adductor Machine.gif" },
      { name: "Calves",          sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/calf-raises.jpg",    gif: "assets/videos/exercises/Calves.gif" },
      { name: "Abs — High Cable Crunch",          sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/leg-press.jpg",      gif: "assets/videos/exercises/Abs — High Cable Crunch.gif" }
    ]
  },

  {
    day: "DAY 03",
    type: "UPPER",
    title: "UPPER",
    image: "assets/images/exercises/incline-press.jpg",
    focus: ["Chest", "Back", "Shoulders", "Biceps", "Triceps"],
    estTime: "60 - 90 Minutes",
    note: "Incline and dumbbell work, higher volume.",
    exercises: [
      { name: "Incline Dumbbell Press", sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/incline-press.jpg",  video: "assets/videos/exercises/bench.mp4" },
      { name: "Pull Ups",               sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/pullups.jpg",         gif: "assets/videos/exercises/upper2-pull-ups.gif" },
      { name: "Barbell Row",            sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/barbell-row.jpg",     gif: "assets/videos/exercises/upper2-barbell-row.gif" },
      { name: "Lateral Raises",         sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/lateral-raises.jpg",  gif: "assets/videos/exercises/upper2-lateral-raises.gif" },
      { name: "Biceps Curl",            sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/biceps-curl.jpg",     gif: "assets/videos/exercises/upper2-biceps-curl.gif" },
      { name: "Rear Delt",       sets: 2, reps: "6 - 10", thumbnail: "assets/images/exercises/triceps-pushdown.jpg", gif: "assets/videos/exercises/upper2-rear-delt.gif" },
      { name: "Triceps Pushdown", sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/incline-press.jpg",  gif: "assets/videos/exercises/upper2-triceps-pushdown.gif" },
      { name: "Cable Biceps Curl — Long Head", sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/incline-press.jpg",  gif: "assets/videos/exercises/upper2-cable-biceps-curl-long-head.gif" },
      { name: "Forearms", sets: 2, reps: "6 - 10",  thumbnail: "assets/images/exercises/incline-press.jpg",  gif: "assets/videos/exercises/upper2-forearms.gif" },
    ]
  },

  {
    day: "DAY 04",
    type: "RECOVERY",
    title: "RECOVERY",
    image: "assets/images/rest.jpg",
    focus: ["Mobility", "Stretching", "Light Cardio"],
    estTime: "As Needed",
    note: "No training today."
  }
];

window.workouts = workouts;

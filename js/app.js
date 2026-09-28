/* =============================================================
   NOUR — MY TRAINING ROUTINE
   app.js — all UI logic (vanilla JS, no dependencies)
   -------------------------------------------------------------
   Data comes from  workouts[]  (js/workouts.js)
   Settings come from CONFIG   (js/config.js)
   Nothing about the split is hardcoded in the markup.
   ============================================================= */

(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (str) => String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- icon library ---------------- */
  const ICONS = {
    instagram: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/>
      </svg>`,
    tiktok: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M14.4 3v9.9a3.4 3.4 0 1 1-2.7-3.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M14.4 3c.5 2.7 2.3 4.4 5 4.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`,
    play: `<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M8.5 5.5 18 12l-9.5 6.5z" fill="currentColor"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 12h15M12.5 5.5 19 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };

  /* ---------------- state ---------------- */
  const state = { workoutIndex: 0, exerciseIndex: 0, lastFocus: null };

  /* =============================================================
     01. NAVBAR
     ============================================================= */
  function renderNav() {
    const nav = $("#navLinks");
    const mobile = $("#mobileLinks");
    if (!nav || !mobile) return;

    nav.innerHTML = CONFIG.nav.map((item) =>
      `<a class="nav-link" href="${esc(item.href)}" data-nav="${esc(item.href)}">${esc(item.label)}</a>`
    ).join("");

    mobile.innerHTML = CONFIG.nav.map((item, i) =>
      `<a class="mobile-link" href="${esc(item.href)}" data-nav="${esc(item.href)}" style="--i:${i}">
         <span class="idx">0${i + 1}</span>${esc(item.label)}
       </a>`
    ).join("");

    $$("#mobileLinks a").forEach((a) =>
      a.addEventListener("click", () => closeMobileMenu()));
  }

  function initScrollSpy() {
    const links = $$(".nav-link, .mobile-link");
    const sections = CONFIG.nav
      .map((n) => document.getElementById(n.href.replace("#", "")))
      .filter(Boolean);
    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((a) =>
        a.classList.toggle("is-active", a.dataset.nav === "#" + id));
    };

    if ("IntersectionObserver" in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      sections.forEach((s) => spy.observe(s));
    }

    const navbar = $("#navbar");
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* =============================================================
     02. MOBILE MENU
     ============================================================= */
  function initMobileMenu() {
    const menu = $("#mobileMenu");
    const toggle = $("#menuToggle");
    const close = $("#menuClose");
    if (!menu || !toggle) return;

    const setOpen = (open) => {
      menu.hidden = false; // keep in DOM for the transition; visibility handles it
      requestAnimationFrame(() => menu.classList.toggle("is-open", open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("is-locked", open);
      if (open) state.lastFocus = document.activeElement;
      else if (state.lastFocus) state.lastFocus.focus();
    };

    window.openMobileMenu = () => setOpen(true);
    window.closeMobileMenu = () => setOpen(false);

    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    close.addEventListener("click", () => setOpen(false));

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024 && menu.classList.contains("is-open")) setOpen(false);
    });
  }

  /* =============================================================
     03. SOCIALS
     ============================================================= */
  function renderSocials() {
    const iconHTML = (s) => ICONS[s.icon] || "";
    const tile = (s) =>
      `<a class="social-link" href="${esc(s.href)}" target="_blank" rel="noopener noreferrer"
           aria-label="${esc(s.label)}" title="${esc(s.label)}">${iconHTML(s)}</a>`;
    const row = (s) =>
      `<a class="contact-link" href="${esc(s.href)}" target="_blank" rel="noopener noreferrer">
         ${iconHTML(s)}<span class="cname">${esc(s.label)}</span>
         <span class="arrow">${ICONS.arrow}</span>
       </a>`;

    const targets = {
      heroSocials: tile,
      footerSocials: tile,
      mobileSocials: tile,
      contactSocials: row
    };
    Object.entries(targets).forEach(([id, tpl]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = CONFIG.social.map(tpl).join("");
    });
  }

  /* =============================================================
     04. SPLIT CARDS
     ============================================================= */
  function renderSplitCards() {
    const wrap = $("#splitCards");
    if (!wrap) return;

    wrap.innerHTML = workouts.map((workout, index) => {
      const num = (workout.day || "").replace(/\D/g, "") || String(index + 1).padStart(2, "0");
      const exerciseCount = (workout.exercises || []).length;
      const meta = [workout.estTime, exerciseCount ? exerciseCount + (exerciseCount === 1 ? " EXERCISE" : " EXERCISES") : null]
        .filter(Boolean).join(" · ");

      return `<div class="split-card-item">
              <button class="card reveal" type="button" data-index="${index}"
              data-delay="${Math.min(index * 80, 400)}" aria-pressed="false"
              aria-label="${esc(workout.day)} ${esc(workout.title)}">
              <img class="card-img" data-scroll-motion src="${esc(workout.image)}" alt="${esc(workout.day)} ${esc(workout.title)} background" loading="lazy" decoding="async" />
              <span class="card-shade" aria-hidden="true"></span>
              <span class="card-num" aria-hidden="true">${esc(num)}</span>
              <span class="card-body">
                <span class="card-day">${esc(workout.day)}</span>
                <span class="card-foot">
                  <span class="card-title">${esc(workout.title)}</span>
                  <span class="card-meta">${esc(meta)}</span>
                </span>
              </span>
              <span class="card-arrow" aria-hidden="true">${ICONS.arrow}</span>
              </button>
            </div>`;
    }).join("");

    $$(".card", wrap).forEach((card) => {
      card.addEventListener("click", () => {
        const index = Number(card.dataset.index);
        selectWorkout(index);
        const target = isRecoveryDay(workouts[index]) ? $("#details") : $("#exercises");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function updateCards() {
    $$("#splitCards .card").forEach((card, i) => {
      const on = i === state.workoutIndex;
      card.classList.toggle("is-active", on);
      card.setAttribute("aria-pressed", String(on));
    });
  }

  /* =============================================================
     05. WORKOUT DETAILS (info / exercises / preview)
     ============================================================= */
  function daysForType(type) {
    const days = workouts.filter((w) => w.type === type).map((w) => w.day);
    return days.length > 1 ? days.join(" / ") : (days[0] || "");
  }

  function renderWorkoutInfo(w) {
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    setText("infoDay", daysForType(w.type) || w.day);
    setText("infoTitle", w.title);
    setText("infoNote", w.note || "");
    setText("infoTime", w.estTime || "—");

    const focusWrap = $("#infoFocus");
    if (focusWrap) {
      focusWrap.innerHTML = w.focus.map((f) =>
        `<li class="focus-tag">${esc(f)}</li>`).join("");
    }
  }

  /* Recovery days have no exercises — show a minimal recovery state
     instead of the exercise table and preview card. */
  function isRecoveryDay(w) {
    return !w || (w.exercises || []).length === 0;
  }

  function setRecoveryMode(on) {
    const grid = $("#detailsGrid");
    if (!grid) return;
    grid.classList.toggle("is-recovery", on);

    const recovery = $(".recovery-state", grid);
    if (recovery) recovery.hidden = !on;

    const tbody = $("#exerciseRows");
    if (tbody && on) tbody.textContent = "";
  }

  function renderExercises(w) {
    const tbody = $("#exerciseRows");
    if (!tbody) return;

    const count = $("#exerciseCount");
    const n = (w.exercises || []).length;
    if (count) {
      count.textContent = n + (n === 1 ? " EXERCISE" : " EXERCISES");
    }

    tbody.innerHTML = (w.exercises || []).map((ex, i) => {
      const n = String(i + 1).padStart(2, "0");
      const demoCell =
        `<button class="ex-demo" type="button" data-demo="${i}" aria-label="Watch demo: ${esc(ex.name)}">
           ${ICONS.play} WATCH DEMO
         </button>`;
      const exerciseMedia = ex.gif
        ? `<img src="${esc(ex.gif)}" alt="${esc(ex.name)}" loading="lazy" decoding="async" />`
        : ex.video
          ? `<video src="${esc(ex.video)}" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`
          : `<img src="${esc(ex.thumbnail)}" alt="${esc(ex.name)}" loading="lazy" decoding="async" />`;

      return `<tr data-ex="${i}" tabindex="0" role="button" aria-label="Select ${esc(ex.name)}">
              <td class="td-num" data-label="" data-day="${esc(w.day)}"><span class="ex-num">${esc(n)}</span></td>
              <td class="td-thumb"><span class="ex-thumb">
                ${exerciseMedia}
              </span></td>
              <td data-label="EXERCISE"><span class="ex-name">${esc(ex.name)}</span></td>
              <td data-label="SETS"><span class="ex-sets">${esc(ex.sets)}</span></td>
              <td data-label="REPS"><span class="ex-reps">${esc(ex.reps)}</span></td>
              <td data-label="DEMO">${demoCell}</td>
            </tr>`;
    }).join("");

    // row interactions
    $$("tr[data-ex]", tbody).forEach((row) => {
      const pick = () => selectExercise(Number(row.dataset.ex));
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-demo]")) return; // demo button handles itself
        pick();
      });
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
      });
    });

    $$("[data-demo]", tbody).forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openDemoModal(Number(btn.dataset.demo));
      }));
  }

  function exerciseTime(i) {
    const secs = (32 + i * 13) % 118;
    return "00:" + String(secs).padStart(2, "0");
  }

  function renderPreview(w, exIndex) {
    const ex = (w.exercises || [])[exIndex] || (w.exercises || [])[0];
    if (!ex) return;

    const img = $("#previewImage");
    const video = $("#previewVideo");
    if (ex.video && video) {
      if (img) img.hidden = true;
      video.hidden = false;
      if (video.getAttribute("src") !== ex.video) {
        video.src = ex.video;
        video.load();
      }
      video.play().catch(() => {});
    } else {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.hidden = true;
      }
      if (img) {
        img.hidden = false;
        img.src = ex.gif || ex.thumbnail;
        img.alt = ex.name;
      }
    }

    const name = $("#previewName");
    if (name) name.textContent = ex.name.toUpperCase();

    const vol = $("#previewVolume");
    if (vol) vol.textContent = ex.sets ? `${ex.sets} × ${ex.reps}` : ex.duration;

    const time = $("#previewTime");
    if (time) time.textContent = exerciseTime(exIndex);

    const play = $("#previewPlay");
    if (play) {
      play.dataset.ex = String(exIndex);
      play.setAttribute("aria-label", "Play demo: " + ex.name);
    }
  }

  function selectWorkout(index) {
    const w = workouts[index];
    if (!w) return;
    state.workoutIndex = index;
    state.exerciseIndex = 0;

    const recovery = isRecoveryDay(w);

    updateCards();
    renderWorkoutInfo(w);
    setRecoveryMode(recovery);
    if (!recovery) {
      renderExercises(w);
      renderPreview(w, 0);
    }

    // restart the gentle content-swap animation
    $$("#detailsGrid .detail-col").forEach((col) => {
      col.classList.remove("is-swapping");
      void col.offsetWidth; // reflow
      col.classList.add("is-swapping");
    });
  }

  function selectExercise(index) {
    const w = workouts[state.workoutIndex];
    if (!w || !w.exercises[index]) return;
    state.exerciseIndex = index;
    renderPreview(w, index);
    $$("#exerciseRows tr[data-ex]").forEach((row, i) =>
      row.classList.toggle("is-selected", i === index));
  }

  /* =============================================================
     06. MODALS (intro video + exercise demos)
     -------------------------------------------------------------
     Video files are optional. If a file is missing or fails to
     load we show a clean placeholder instead of breaking the UI.
     ============================================================= */
  function stageVideo(video, placeholder, src, autoplay = false, muted = false) {
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      video.hidden = true;
      if (placeholder) placeholder.hidden = false;
    };
    const ok = () => {
      if (settled) return;
      settled = true;
      video.hidden = false;
      if (placeholder) placeholder.hidden = true;
    };

    if (placeholder) placeholder.hidden = true;
    video.hidden = false;
    video.muted = muted;

    video.addEventListener("error", fail, { once: true });
    video.addEventListener("loadeddata", ok, { once: true });
    video.addEventListener("canplay", ok, { once: true });

    try {
      video.src = src || "";
      video.load();
      if (autoplay) {
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    } catch (err) {
      fail();
      return;
    }

    // Allow slower mobile connections to finish before showing the fallback.
    setTimeout(() => {
      if (settled) return;
      try {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ok();
        else if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fail();
      } catch (err) { fail(); }
    }, 10000);
  }

  function unstageVideo(video) {
    try {
      video.pause();
      video.removeAttribute("src");
      video.load();
    } catch (err) { /* no-op */ }
  }

  function stageGif(gif, placeholder, src, exerciseName) {
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      gif.hidden = true;
      if (placeholder) placeholder.hidden = false;
    };
    const ok = () => {
      if (settled) return;
      settled = true;
      gif.hidden = false;
      if (placeholder) placeholder.hidden = true;
    };

    if (placeholder) placeholder.hidden = true;
    gif.hidden = false;
    gif.alt = exerciseName + " technique animation";
    gif.addEventListener("load", ok, { once: true });
    gif.addEventListener("error", fail, { once: true });
    if (src) {
      const separator = src.includes("?") ? "&" : "?";
      gif.src = src + separator + "v=" + Date.now();
    } else {
      fail();
    }
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    state.lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("is-locked");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    const first = modal.querySelector("[data-close-modal]");
    if (first) first.focus();
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.classList.remove("is-open");
    window.setTimeout(() => {
      modal.hidden = true;
      const v = modal.querySelector("video");
      if (v) unstageVideo(v);
      const gif = modal.querySelector(".modal-gif");
      if (gif) {
        gif.removeAttribute("src");
        gif.hidden = true;
      }
      const ph = modal.querySelector(".media-placeholder");
      if (ph) ph.hidden = true;
    }, 360);
    document.body.classList.remove("is-locked");
    if (state.lastFocus) state.lastFocus.focus();
  }

  function initModals() {
    // every [data-close-modal] trigger closes its modal
    $$("[data-close-modal]").forEach((trigger) =>
      trigger.addEventListener("click", () => closeModal(trigger.closest(".modal"))));

    // intro modal
    const introOpen = $("#introOpen");
    if (introOpen) {
      introOpen.addEventListener("click", () => {
        const video = $("#introVideo");
        const ph = $("#introPlaceholder");
        if (video) stageVideo(video, ph, CONFIG.assets.introVideo);
        openModal("introModal");
      });
    }

    // exercise demo modal (launched from the preview play button)
    const previewPlay = $("#previewPlay");
    if (previewPlay) {
      previewPlay.addEventListener("click", () => {
        const idx = Number(previewPlay.dataset.ex || 0);
        openDemoModal(idx);
      });
    }

    // ESC closes whatever is open
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const open = $(".modal.is-open");
      if (open) { closeModal(open); return; }
      if (window.innerWidth <= 1024) window.closeMobileMenu && window.closeMobileMenu();
    });
  }

  function openDemoModal(index) {
    const w = workouts[state.workoutIndex];
    const ex = w && (w.exercises || [])[index];
    if (!ex) return;

    selectExercise(index);

    const title = $("#demoModalTitle");
    if (title) title.textContent = ex.name.toUpperCase();

    const sub = $("#demoPlaceholderLabel");
    if (sub) sub.textContent = ex.name.toUpperCase() + (ex.gif ? " — GIF COMING SOON" : " — DEMO COMING SOON");

    const placeholderSub = $("#demoPlaceholderSub");
    if (placeholderSub) {
      placeholderSub.textContent = ex.gif ? "Add the GIF at " + ex.gif : "Drop a file in assets/videos/exercises/";
    }

    const meta = $("#demoMeta");
    if (meta) {
      const volume = ex.sets ? `${ex.sets} SETS · ${ex.reps} REPS` : ex.duration;
      meta.innerHTML =
        `<span>${esc(w.day)} · ${esc(w.title)}</span><span><strong>${esc(volume)}</strong></span>`;
    }
    const video = $("#demoVideo");
    const gif = $("#demoGif");
    const ph = $("#demoPlaceholder");
    openModal("demoModal");

    if (gif) {
      gif.removeAttribute("src");
      gif.hidden = true;
    }
    if (ex.gif && gif) {
      if (video) {
        unstageVideo(video);
        video.hidden = true;
      }
      stageGif(gif, ph, ex.gif, ex.name);
    } else if (video) {
      stageVideo(video, ph, ex.video, true, true);
    }
  }

  /* =============================================================
     07. THEME TOGGLE
     ============================================================= */
  function initTheme() {
    const toggle = $("#themeToggle");
    if (!toggle) return;

    const apply = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      toggle.setAttribute("aria-pressed", String(theme === "light"));
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", theme === "light" ? "#E9E9E6" : "#050607");
    };

    const stored = (() => {
      try { return localStorage.getItem("nour-theme"); } catch (e) { return null; }
    })();

    const initial = stored
      || (CONFIG.settings.respectSystemTheme &&
          window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      || CONFIG.settings.defaultTheme;

    apply(initial);

    toggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      apply(next);
      try { localStorage.setItem("nour-theme", next); } catch (e) { /* storage blocked */ }
    });

    // follow the system if the user hasn't picked explicitly
    if (!stored && CONFIG.settings.respectSystemTheme && "matchMedia" in window) {
      window.matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("nour-theme")) apply(e.matches ? "light" : "dark");
        });
    }
  }

  /* =============================================================
     08. SCROLL REVEAL
     ============================================================= */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    items.forEach((el) => {
      const d = Number(el.dataset.delay || 0);
      if (d) el.style.setProperty("--d", d + "ms");
    });

    if (!CONFIG.settings.scrollReveal ||
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle("is-visible", e.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    items.forEach((el) => io.observe(el));
  }

  function initScrollMotion() {
    const items = $$("[data-scroll-motion]");
    if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const viewportHeight = window.innerHeight;

      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const distance = viewportHeight / 2 - (rect.top + rect.height / 2);
        const offset = Math.max(-28, Math.min(28, distance * 0.08));
        el.style.setProperty("--scroll-offset", offset.toFixed(1) + "px");
      });
    };

    const scheduleUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
  }

  /* =============================================================
     09. MISC
     ============================================================= */
  function initMisc() {
    const year = $("#currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    // keep in-page anchors clear of the fixed navbar
    $$("main section[id]").forEach((s) => {
      s.style.scrollMarginTop = "calc(var(--nav-h) + 14px)";
    });

    // disable smooth scroll when configured off
    if (CONFIG.settings.smoothScroll === false) {
      document.documentElement.style.scrollBehavior = "auto";
    }
  }

  /* =============================================================
     INIT
     ============================================================= */
  function init() {
    renderNav();
    renderSocials();
    renderSplitCards();
    initMobileMenu();
    initModals();
    initTheme();
    initScrollSpy();
    initReveal();
    initScrollMotion();
    initMisc();
    selectWorkout(0); // default to DAY 01
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

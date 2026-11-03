/* Projects: year tabs, launch countdowns and date-gated links.
   Lives in js/projects.js, loaded after main.js and chat.js. */
(function () {
  const tabs = document.querySelectorAll(".year-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    });
  });

  /* Show more: unfolds the extra detail in a card, and folds it back */
  document.querySelectorAll(".show-more").forEach((btn) => {
    const more = document.getElementById(btn.getAttribute("aria-controls"));
    if (!more) return;
    const closedLabel = btn.textContent;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      more.hidden = open;
      btn.textContent = open ? closedLabel : "Show less";
    });
  });

  /* Links that only work from a date (a domain that is not live yet):
     the link stays hidden and its note shows until that date, then they swap. */
  function gate() {
    const now = Date.now();
    document.querySelectorAll("[data-live-from]").forEach((el) => {
      el.hidden = now < Date.parse(el.dataset.liveFrom);
    });
    document.querySelectorAll("[data-before-live]").forEach((el) => {
      el.hidden = now >= Date.parse(el.dataset.beforeLive);
    });
  }

  const clocks = document.querySelectorAll(".countdown[data-launch]");
  function tick() {
    const now = Date.now();
    clocks.forEach((el) => {
      const ms = Date.parse(el.dataset.launch) - now;
      if (ms <= 0) { el.textContent = "Live now"; return; }
      const d = Math.floor(ms / 864e5);
      const h = Math.floor((ms % 864e5) / 36e5);
      const m = Math.floor((ms % 36e5) / 6e4);
      el.textContent = `${d}d ${h}h ${m}m to go`;
    });
  }

  gate();
  if (clocks.length) tick();
  setInterval(() => { gate(); if (clocks.length) tick(); }, 30000);
})();

/* Projects: year tabs and launch countdowns.
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
  if (clocks.length) { tick(); setInterval(tick, 30000); }
})();

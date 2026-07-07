// demo.js — client-side simulated PulseBand demo widgets
(function () {
    var root = document.querySelector(".demo-panel");
    if (!root) return;

    /* ---------- Tab switching ---------- */
    var tabs = root.querySelectorAll(".demo-tab");
    var views = root.querySelectorAll(".demo-view");

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
            views.forEach(function (v) { v.classList.remove("is-active"); });
            tab.setAttribute("aria-selected", "true");
            document.getElementById(tab.getAttribute("aria-controls")).classList.add("is-active");
        });
        tab.addEventListener("keydown", function (e) {
            var list = Array.prototype.slice.call(tabs);
            var idx = list.indexOf(tab);
            if (e.key === "ArrowRight") list[(idx + 1) % list.length].focus();
            if (e.key === "ArrowLeft") list[(idx - 1 + list.length) % list.length].focus();
        });
    });

    /* ---------- Heart rate simulator ---------- */
    var bpmEl = document.getElementById("bpm-value");
    var hrPath = document.getElementById("hr-path");
    var startBtn = document.getElementById("hr-start");
    var stopBtn = document.getElementById("hr-stop");
    var modeSelect = document.getElementById("hr-mode");
    var hrTimer = null;

    var baselines = { resting: 64, walking: 96, running: 148 };

    function buildEcgPath(bpm) {
        // more beats drawn as bpm rises
        var beats = Math.max(3, Math.round(bpm / 24));
        var width = 600, height = 100, mid = height / 2;
        var segment = width / beats;
        var d = "M0," + mid;
        for (var i = 0; i < beats; i++) {
            var x = i * segment;
            d += " L" + (x + segment * 0.35) + "," + mid;
            d += " L" + (x + segment * 0.45) + "," + (mid - 30);
            d += " L" + (x + segment * 0.52) + "," + (mid + 40);
            d += " L" + (x + segment * 0.6) + "," + (mid - 10);
            d += " L" + (x + segment * 0.75) + "," + mid;
            d += " L" + (x + segment) + "," + mid;
        }
        return d;
    }

    function tickHeartRate() {
        var mode = modeSelect ? modeSelect.value : "resting";
        var base = baselines[mode] || 64;
        var bpm = base + Math.round((Math.random() - 0.5) * 8);
        bpmEl.textContent = bpm;
        if (hrPath) hrPath.setAttribute("d", buildEcgPath(bpm));
        localStorage.setItem("pulseband_last_bpm", JSON.stringify({ bpm: bpm, mode: mode, at: Date.now() }));
    }

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            if (hrTimer) return;
            tickHeartRate();
            hrTimer = setInterval(tickHeartRate, 1400);
            startBtn.disabled = true;
            stopBtn.disabled = false;
        });
    }
    if (stopBtn) {
        stopBtn.addEventListener("click", function () {
            clearInterval(hrTimer);
            hrTimer = null;
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });
        stopBtn.disabled = true;
    }

    // restore last reading on load
    var stored = localStorage.getItem("pulseband_last_bpm");
    if (stored && bpmEl) {
        try {
            var data = JSON.parse(stored);
            bpmEl.textContent = data.bpm;
            if (hrPath) hrPath.setAttribute("d", buildEcgPath(data.bpm));
            if (modeSelect) modeSelect.value = data.mode;
        } catch (e) { /* ignore malformed storage */ }
    } else if (hrPath) {
        hrPath.setAttribute("d", buildEcgPath(64));
    }

    /* ---------- Sleep cycle chart toggle ---------- */
    var sleepToggle = document.getElementById("sleep-range");
    var sleepBars = document.getElementById("sleep-bars");

    var sleepData = {
        night: [20, 45, 90, 100, 70, 40, 85, 95, 60, 30, 20, 15],
        week: [70, 62, 88, 74, 55, 90, 66, 40, 78, 82, 60, 71],
    };

    function renderSleep(range) {
        if (!sleepBars) return;
        sleepBars.innerHTML = "";
        sleepData[range].forEach(function (value, i) {
            var bar = document.createElement("div");
            bar.className = "bar" + (value > 80 ? " deep" : "");
            bar.style.height = value + "%";
            bar.title = range === "night" ? "Hour " + (i + 1) : "Day " + (i + 1);
            sleepBars.appendChild(bar);
        });
        localStorage.setItem("pulseband_sleep_range", range);
    }

    if (sleepToggle) {
        sleepToggle.addEventListener("change", function (e) {
            renderSleep(e.target.value);
        });
        var savedRange = localStorage.getItem("pulseband_sleep_range") || "night";
        sleepToggle.value = savedRange;
        renderSleep(savedRange);
    }

    /* ---------- Hydration reminder popup ---------- */
    var toast = document.getElementById("hydration-toast");
    var dismissBtn = document.getElementById("hydration-dismiss");
    var triggerBtn = document.getElementById("hydration-trigger");

    function showToast() {
        if (!toast) return;
        toast.classList.add("is-visible");
        localStorage.setItem("pulseband_last_hydration_nudge", Date.now().toString());
    }
    function hideToast() {
        if (toast) toast.classList.remove("is-visible");
    }

    if (triggerBtn) triggerBtn.addEventListener("click", showToast);
    if (dismissBtn) dismissBtn.addEventListener("click", hideToast);

    // Auto-surface once per demo visit, after a short delay
    if (toast && !sessionStorage.getItem("pulseband_hydration_shown")) {
        setTimeout(function () {
            showToast();
            sessionStorage.setItem("pulseband_hydration_shown", "true");
        }, 6000);
    }
})();
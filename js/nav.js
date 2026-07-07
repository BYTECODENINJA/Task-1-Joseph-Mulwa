// nav.js — accessible mobile navigation toggle
(function () {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");

    if (!toggle || !menu) return;

    function closeMenu() {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
    }

    function openMenu() {
        toggle.setAttribute("aria-expanded", "true");
        menu.classList.add("is-open");
    }

    toggle.addEventListener("click", function () {
        var isOpen = toggle.getAttribute("aria-expanded") === "true";
        isOpen ? closeMenu() : openMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
            closeMenu();
            toggle.focus();
        }
    });

    // Close when a link is chosen (mobile)
    menu.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth < 768) closeMenu();
        });
    });

    // Reset state when resizing up to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth >= 768) closeMenu();
    });
})();
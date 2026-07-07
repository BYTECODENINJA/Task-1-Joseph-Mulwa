// forms.js — lightweight inline validation (no backend/database)
(function () {
    var form = document.getElementById("signup-form");
    if (!form) return;

    var status = document.getElementById("form-status");

    var validators = {
        name: function (v) {
            return v.trim().length >= 2 ? "" : "Enter your full name.";
        },
        email: function (v) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(v.trim()) ? "" : "Enter a valid email address.";
        },
        reason: function (v) {
            return v ? "" : "Choose a reason for reaching out.";
        },
        message: function (v) {
            return v.trim().length >= 10 ? "" : "Message needs at least 10 characters.";
        },
    };

    function fieldWrap(input) {
        return input.closest(".field");
    }

    function showError(input, message) {
        var wrap = fieldWrap(input);
        var errorEl = wrap.querySelector(".field-error");
        if (message) {
            wrap.classList.add("has-error");
            errorEl.textContent = message;
            input.setAttribute("aria-invalid", "true");
        } else {
            wrap.classList.remove("has-error");
            errorEl.textContent = "";
            input.removeAttribute("aria-invalid");
        }
    }

    function validateField(input) {
        var validator = validators[input.name];
        if (!validator) return true;
        var message = validator(input.value);
        showError(input, message);
        return message === "";
    }

    Object.keys(validators).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        input.addEventListener("blur", function () {
            validateField(input);
        });
        input.addEventListener("input", function () {
            if (fieldWrap(input).classList.contains("has-error")) validateField(input);
        });
    });

    form.addEventListener("submit", function (e) {
        var allValid = true;
        Object.keys(validators).forEach(function (name) {
            var input = form.elements[name];
            if (!input) return;
            if (!validateField(input)) allValid = false;
        });

        if (!allValid) {
            e.preventDefault();
            status.textContent = "Please fix the highlighted fields before sending.";
            status.classList.remove("is-error");
            status.classList.add("is-visible", "is-error");
            status.focus();
            return;
        }

        // No backend configured in this static build: simulate a successful send.
        if (form.getAttribute("data-static-demo") === "true") {
            e.preventDefault();
            status.classList.remove("is-error");
            status.textContent = "Thanks — your message is on its way. We reply within one business day.";
            status.classList.add("is-visible");
            form.reset();
        }
    });
})();
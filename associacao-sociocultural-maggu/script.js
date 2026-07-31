(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.innerHTML = isOpen
        ? '<svg width="24" height="24"><use href="#ic-close"/></svg>'
        : '<svg width="24" height="24"><use href="#ic-menu"/></svg>';
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<svg width="24" height="24"><use href="#ic-menu"/></svg>';
      });
    });
  }

  // ---- Back to top button ----
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener(
      "scroll",
      function () {
        toTop.classList.toggle("show", window.scrollY > 480);
      },
      { passive: true }
    );
  }

  // ---- Only one program/faq accordion open per group at a time (progressive enhancement) ----
  document.querySelectorAll(".program-card").forEach(function (card) {
    card.addEventListener("toggle", function () {
      if (!card.open) return;
      document.querySelectorAll(".program-card").forEach(function (other) {
        if (other !== card) other.open = false;
      });
    });
  });

  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      document.querySelectorAll(".faq-item").forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();

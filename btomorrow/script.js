(function () {
  "use strict";

  // Mobile menu
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Nav shadow on scroll
  var nav = document.getElementById("nav");
  var lastY = 0;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      if (nav) {
        nav.style.boxShadow = y > 8 ? "0 1px 0 rgba(0,0,0,0.4)" : "none";
      }
      lastY = y;
    },
    { passive: true }
  );

  // Modal
  var modal = document.getElementById("modal");
  var openTriggers = document.querySelectorAll("[data-open-modal]");
  var closeTriggers = document.querySelectorAll("[data-close-modal]");
  var modalForm = document.getElementById("modalForm");
  var modalSuccess = document.getElementById("modalSuccess");
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var firstField = modal.querySelector("input, textarea, button");
    if (firstField) firstField.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  openTriggers.forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });
  closeTriggers.forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      modalForm.hidden = true;
      if (modalSuccess) modalSuccess.hidden = false;
    });
  }

  // Reset modal state each time it's opened (in case it was submitted before)
  openTriggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (modalForm) modalForm.hidden = false;
      if (modalSuccess) modalSuccess.hidden = true;
    });
  });
})();

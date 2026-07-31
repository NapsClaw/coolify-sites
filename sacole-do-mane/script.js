(function(){
  "use strict";

  // ---- CONFIG ----
  // WhatsApp oficial do Sacolé do Mané (Fernando).
  var WHATSAPP_NUMBER = "5511936188206";

  function buildWhatsLink(message){
    var text = encodeURIComponent(message || "Oi! Vim pelo site do Sacolé do Mané e quero fazer um pedido 🍧");
    if (WHATSAPP_NUMBER) {
      return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
    }
    return "https://wa.me/?text=" + text;
  }

  document.querySelectorAll(".whats-link").forEach(function(el){
    el.setAttribute("href", buildWhatsLink(el.getAttribute("data-msg")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // ---- MOBILE NAV ----
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobile-nav");
  if (burger && mobileNav) {
    burger.addEventListener("click", function(){
      var isOpen = mobileNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burger.classList.toggle("is-active", isOpen);
    });
    mobileNav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        mobileNav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- FOOTER YEAR ----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- HEADER SHADOW ON SCROLL ----
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function(){
      if (window.scrollY > 10) header.style.boxShadow = "0 6px 18px rgba(43,23,48,.08)";
      else header.style.boxShadow = "none";
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
  }

})();

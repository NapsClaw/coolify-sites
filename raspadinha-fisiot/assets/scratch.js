/* ============================================================
   Raspadinha FISIOT por Elas — lógica da página pública
   ============================================================ */
(function () {
  "use strict";

  var form = document.getElementById("unlock-form");
  var input = document.getElementById("code-input");
  var inputRow = document.getElementById("code-input-row");
  var msg = document.getElementById("form-msg");
  var accessSection = document.getElementById("acesso");
  var scratchSection = document.getElementById("raspadinha");
  var canvas = document.getElementById("scratch-canvas");
  var revealAllBtn = document.getElementById("reveal-all-btn");
  var tryAnotherBtn = document.getElementById("try-another-btn");

  var ctx = canvas.getContext("2d");
  var scratching = false;
  var revealed = false;
  var lastCheck = 0;

  /* ---------- validação de código ---------- */
  function showError(text) {
    msg.textContent = text;
    msg.className = "form-msg error";
    inputRow.classList.add("invalid");
    setTimeout(function () { inputRow.classList.remove("invalid"); }, 420);
  }

  function showOk(text) {
    msg.textContent = text;
    msg.className = "form-msg ok";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = input.value;
    var code = FFEStorage.normalize(raw);

    if (!code) {
      showError("Digite o código que você recebeu para continuar.");
      return;
    }

    if (code === FFEStorage.DEMO_CODE) {
      showOk("Código de demonstração aceito! Preparando sua raspadinha…");
      unlockScratch();
      return;
    }

    var found = FFEStorage.findCode(code);
    if (found) {
      showOk("Código válido! Preparando sua raspadinha…");
      FFEStorage.updateStatus(code, "utilizado");
      unlockScratch();
      return;
    }

    showError("Código inválido. Confira com a organização e tente novamente.");
  });

  function unlockScratch() {
    setTimeout(function () {
      accessSection.style.display = "none";
      scratchSection.classList.add("is-active");
      scratchSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setupCanvas();
    }, 420);
  }

  tryAnotherBtn.addEventListener("click", function () {
    scratchSection.classList.remove("is-active");
    accessSection.style.display = "";
    input.value = "";
    msg.textContent = "";
    msg.className = "form-msg";
    revealed = false;
    accessSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { input.focus(); }, 400);
  });

  /* ---------- raspadinha (canvas) ---------- */
  function setupCanvas() {
    var frame = canvas.parentElement;
    var rect = frame.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    canvas.style.opacity = "1";
    canvas.style.display = "block";
    canvas.style.transition = "opacity .6s ease";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    revealed = false;

    drawFoil(rect.width, rect.height);
    attachPointerEvents();
  }

  function drawFoil(w, h) {
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#d9497e");
    grad.addColorStop(0.5, "#8a67c6");
    grad.addColorStop(1, "#24a98d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // textura em faixas diagonais suaves
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    for (var x = -h; x < w + h; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
    ctx.restore();

    // texto central
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.font = "700 " + Math.max(16, w * 0.065) + "px 'Libre Franklin', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RASPE AQUI", w / 2, h / 2 - h * 0.08);
    ctx.font = "400 " + Math.max(12, w * 0.04) + "px 'Libre Franklin', sans-serif";
    ctx.fillText("🎗️ Caminhada FISIOT por Elas", w / 2, h / 2 + h * 0.1);
    ctx.restore();
  }

  function getPos(evt) {
    var rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  }

  function scratchAt(x, y) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function attachPointerEvents() {
    canvas.onpointerdown = function (e) {
      scratching = true;
      canvas.setPointerCapture(e.pointerId);
      var p = getPos(e);
      scratchAt(p.x, p.y);
    };
    canvas.onpointermove = function (e) {
      if (!scratching) return;
      var p = getPos(e);
      scratchAt(p.x, p.y);
      throttledCheck();
    };
    canvas.onpointerup = function () { scratching = false; checkRevealProgress(); };
    canvas.onpointerleave = function () { scratching = false; };
    canvas.onpointercancel = function () { scratching = false; };
  }

  function throttledCheck() {
    var now = Date.now();
    if (now - lastCheck < 160) return;
    lastCheck = now;
    checkRevealProgress();
  }

  function checkRevealProgress() {
    if (revealed) return;
    var w = canvas.width, h = canvas.height;
    var data;
    try {
      data = ctx.getImageData(0, 0, w, h).data;
    } catch (e) { return; }
    var total = 0, cleared = 0;
    var step = 40; // amostragem para performance
    for (var i = 3; i < data.length; i += step) {
      total++;
      if (data[i] === 0) cleared++;
    }
    var pct = cleared / total;
    if (pct > 0.5) completeReveal();
  }

  function completeReveal() {
    if (revealed) return;
    revealed = true;
    canvas.style.opacity = "0";
    setTimeout(function () {
      canvas.style.display = "none";
      canvas.onpointerdown = canvas.onpointermove = canvas.onpointerup = null;
    }, 620);
    launchConfetti();
  }

  revealAllBtn.addEventListener("click", function () {
    completeReveal();
  });

  /* ---------- confete de celebração ---------- */
  var confettiCanvas = document.getElementById("confetti-canvas");
  var cctx = confettiCanvas.getContext("2d");
  var confettiColors = ["#d9497e", "#8a67c6", "#4bc9ac", "#f0d18f", "#e9769f"];

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  function launchConfetti() {
    var pieces = [];
    var count = 90;
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3,
        vy: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 2,
        color: confettiColors[i % confettiColors.length]
      });
    }
    var start = Date.now();
    function frame() {
      var elapsed = Date.now() - start;
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      pieces.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cctx.restore();
      });
      if (elapsed < 2600) {
        requestAnimationFrame(frame);
      } else {
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", function () {
    if (scratchSection.classList.contains("is-active") && !revealed) {
      setupCanvas();
    }
  });
})();

/* ============================================================
   Painel interno (demonstração) — Raspadinha FISIOT por Elas
   ============================================================ */
(function () {
  "use strict";

  var MESSAGE_TEMPLATE =
    "Olá! Seu código da raspadinha da Caminhada FISIOT por Elas é: [CÓDIGO] 🎁\nAcesse a raspadinha, digite seu código e revele sua surpresa.";

  var gateCard = document.getElementById("gate-card");
  var gateCheckbox = document.getElementById("gate-checkbox");
  var gateEnterBtn = document.getElementById("gate-enter-btn");
  var adminPanel = document.getElementById("admin-panel");

  gateCheckbox.addEventListener("change", function () {
    gateEnterBtn.disabled = !gateCheckbox.checked;
  });

  gateEnterBtn.addEventListener("click", function () {
    gateCard.style.display = "none";
    adminPanel.classList.add("is-active");
    renderTable();
  });

  var nomeInput = document.getElementById("in-nome");
  var whatsInput = document.getElementById("in-whats");
  var genBtn = document.getElementById("gen-btn");
  var resultBox = document.getElementById("result-box");
  var resultCode = document.getElementById("result-code");
  var copyCodeBtn = document.getElementById("copy-code-btn");
  var copyMsgBtn = document.getElementById("copy-msg-btn");
  var tbody = document.getElementById("codes-tbody");
  var emptyState = document.getElementById("empty-state");

  var currentCode = null;

  genBtn.addEventListener("click", function () {
    var code = FFEStorage.generateUniqueCode();
    var entry = FFEStorage.addCode({
      code: code,
      nome: nomeInput.value,
      whatsapp: whatsInput.value
    });
    currentCode = entry.code;
    resultCode.textContent = entry.code;
    resultBox.classList.add("show");
    nomeInput.value = "";
    whatsInput.value = "";
    renderTable();
  });

  function copyText(text, btn) {
    var done = function () {
      var original = btn.textContent;
      btn.textContent = "Copiado ✓";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }

  copyCodeBtn.addEventListener("click", function () {
    if (!currentCode) return;
    copyText(currentCode, copyCodeBtn);
  });

  copyMsgBtn.addEventListener("click", function () {
    if (!currentCode) return;
    var msg = MESSAGE_TEMPLATE.replace("[CÓDIGO]", currentCode);
    copyText(msg, copyMsgBtn);
  });

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch (e) { return ""; }
  }

  function renderTable() {
    var list = FFEStorage.getCodes();
    tbody.innerHTML = "";

    if (!list.length) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    list.forEach(function (item) {
      var tr = document.createElement("tr");

      var statusLabel = { novo: "Novo", enviado: "Enviado", utilizado: "Utilizado" }[item.status] || "Novo";

      tr.innerHTML =
        '<td class="code-cell">' + escapeHtml(item.code) + "</td>" +
        "<td>" + (escapeHtml(item.nome) || "—") + "</td>" +
        "<td>" + (escapeHtml(item.whatsapp) || "—") + "</td>" +
        '<td><span class="status-pill ' + item.status + '">' + statusLabel + "</span></td>" +
        '<td class="row-actions"></td>';

      var actionsCell = tr.querySelector(".row-actions");

      if (item.status === "novo") {
        var sendBtn = document.createElement("button");
        sendBtn.className = "mini-btn";
        sendBtn.type = "button";
        sendBtn.textContent = "Marcar enviado";
        sendBtn.addEventListener("click", function () {
          FFEStorage.updateStatus(item.code, "enviado");
          renderTable();
        });
        actionsCell.appendChild(sendBtn);
      }

      var copyMsgMini = document.createElement("button");
      copyMsgMini.className = "mini-btn";
      copyMsgMini.type = "button";
      copyMsgMini.textContent = "Copiar msg";
      copyMsgMini.addEventListener("click", function () {
        copyText(MESSAGE_TEMPLATE.replace("[CÓDIGO]", item.code), copyMsgMini);
      });
      actionsCell.appendChild(copyMsgMini);

      var delBtn = document.createElement("button");
      delBtn.className = "mini-btn danger";
      delBtn.type = "button";
      delBtn.textContent = "Remover";
      delBtn.addEventListener("click", function () {
        FFEStorage.removeCode(item.code);
        renderTable();
      });
      actionsCell.appendChild(delBtn);

      tbody.appendChild(tr);
    });
  }
})();

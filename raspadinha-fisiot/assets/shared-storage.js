/* ============================================================
   FFEStorage — armazenamento local compartilhado (demonstração)
   Usado pela página pública e pelo painel /admin.
   Tudo fica salvo apenas no localStorage deste navegador.
   ============================================================ */
(function (global) {
  "use strict";

  var STORAGE_KEY = "ffe_raspadinha_codes_v1";
  var DEMO_CODE = "FISIOT-DEMO";
  var CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem O/0/I/1 para evitar confusão

  function safeParse(json) {
    try {
      var v = JSON.parse(json);
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }

  function getCodes() {
    if (typeof localStorage === "undefined") return [];
    return safeParse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  function saveCodes(list) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function normalize(code) {
    return String(code || "").trim().toUpperCase();
  }

  function randomSuffix(len) {
    var out = "";
    var arr = new Uint32Array(len);
    if (global.crypto && global.crypto.getRandomValues) {
      global.crypto.getRandomValues(arr);
    } else {
      for (var i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 4294967295);
    }
    for (var j = 0; j < len; j++) {
      out += CODE_ALPHABET[arr[j] % CODE_ALPHABET.length];
    }
    return out;
  }

  function generateUniqueCode() {
    var list = getCodes();
    var existing = {};
    list.forEach(function (c) { existing[normalize(c.code)] = true; });
    var code;
    do {
      code = "FISIOT-" + randomSuffix(5);
    } while (existing[code] || code === DEMO_CODE);
    return code;
  }

  function addCode(entry) {
    var list = getCodes();
    var item = {
      code: normalize(entry.code),
      nome: (entry.nome || "").trim(),
      whatsapp: (entry.whatsapp || "").trim(),
      status: "novo",
      createdAt: new Date().toISOString()
    };
    list.unshift(item);
    saveCodes(list);
    return item;
  }

  function findCode(code) {
    var target = normalize(code);
    var list = getCodes();
    for (var i = 0; i < list.length; i++) {
      if (normalize(list[i].code) === target) return list[i];
    }
    return null;
  }

  function updateStatus(code, status) {
    var target = normalize(code);
    var list = getCodes();
    var changed = false;
    list.forEach(function (item) {
      if (normalize(item.code) === target) {
        item.status = status;
        changed = true;
      }
    });
    if (changed) saveCodes(list);
    return changed;
  }

  function removeCode(code) {
    var target = normalize(code);
    var list = getCodes().filter(function (item) { return normalize(item.code) !== target; });
    saveCodes(list);
  }

  global.FFEStorage = {
    STORAGE_KEY: STORAGE_KEY,
    DEMO_CODE: DEMO_CODE,
    getCodes: getCodes,
    saveCodes: saveCodes,
    normalize: normalize,
    generateUniqueCode: generateUniqueCode,
    addCode: addCode,
    findCode: findCode,
    updateStatus: updateStatus,
    removeCode: removeCode
  };
})(window);

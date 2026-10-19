/* Prévia da Comunidade — somente interface. Não coleta, envia nem salva nada. */
(function () {
  var dlg = document.getElementById('aviso-previa');
  var title = document.getElementById('dlg-titulo');
  var text = document.getElementById('dlg-texto');
  var titles = {
    'Criar minha conta': 'Criar conta: em breve',
    'Entrar': 'Entrar: em breve',
    'Publicar': 'Publicar: em breve',
    'Chat da Comunidade': 'Chat: em breve',
    'Mural': 'Mural: em breve',
    'Seu perfil': 'Perfil: em breve'
  };
  var base = 'A comunidade está em preparação';

  function openDlg(label) {
    title.textContent = titles[label] || base;
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
  }
  function closeDlg() {
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }

  document.querySelectorAll('[data-preview]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openDlg(el.getAttribute('data-preview'));
    });
  });
  document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', closeDlg);
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) closeDlg(); // clique no fundo escuro
  });

  /* destaque do atalho da seção visível (apenas visual) */
  var links = [].slice.call(document.querySelectorAll('.jump a'));
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on'); });
          var a = map[en.target.id];
          if (a) {
            a.classList.add('on');
            var box = a.parentNode.parentNode;
            if (box.scrollWidth > box.clientWidth) {
              box.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
            }
          }
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }
})();

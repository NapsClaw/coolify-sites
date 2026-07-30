// Raio Életric — interações da vitrine

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.classList.toggle('active', isOpen);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  document.addEventListener('click', (e) => {
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // FAQ — mantém apenas um item aberto por vez
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });

  // ===================== VITRINE =====================
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const chips = Array.from(document.querySelectorAll('.cat-chip'));
  const catNavLinks = Array.from(document.querySelectorAll('.category-nav a[data-filter], .quicklink-tile[data-filter]'));
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.getElementById('searchForm');
  const sortSelect = document.getElementById('sortSelect');
  const countEl = document.getElementById('catalogCount');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  const INITIAL_VISIBLE = 10; // 2 linhas de 5 no desktop
  let currentFilter = 'all';
  let currentSearch = '';
  let expanded = false;

  function applyState() {
    const term = currentSearch.trim().toLowerCase();

    // filtra por categoria + busca
    let visible = cards.filter(card => {
      const matchesCat = currentFilter === 'all' || card.dataset.cat === currentFilter;
      const matchesSearch = !term || card.dataset.name.includes(term);
      return matchesCat && matchesSearch;
    });

    cards.forEach(card => card.classList.add('is-hidden'));

    const limit = expanded ? visible.length : Math.min(INITIAL_VISIBLE, visible.length);
    visible.slice(0, limit).forEach(card => card.classList.remove('is-hidden'));

    if (countEl) {
      countEl.textContent = `${visible.length} produto${visible.length === 1 ? '' : 's'}`;
    }

    if (loadMoreBtn) {
      loadMoreBtn.hidden = visible.length <= INITIAL_VISIBLE;
      loadMoreBtn.textContent = expanded ? 'Mostrar menos' : 'Mostrar mais produtos';
    }
  }

  function setFilter(filter) {
    currentFilter = filter;
    expanded = false;
    chips.forEach(chip => chip.classList.toggle('active', chip.dataset.filter === filter));
    applyState();
  }

  function reorder(mode) {
    let sorted = [...cards];
    if (mode === 'menor-preco') {
      sorted.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (mode === 'maior-preco') {
      sorted.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    } else if (mode === 'az') {
      sorted.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    } else {
      sorted = cards; // relevância = ordem original
    }
    sorted.forEach(card => grid.appendChild(card));
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      setFilter(chip.dataset.filter);
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  catNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = link.dataset.filter;
      if (filter) setFilter(filter);
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      expanded = true; // ao buscar, mostra todos os resultados
      applyState();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      reorder(sortSelect.value);
      applyState();
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      expanded = !expanded;
      applyState();
      if (!expanded) {
        document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  applyState();
});

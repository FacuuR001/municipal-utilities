
(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(textarea); }
    return Promise.resolve();
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var wrap = button.closest('.docs-code-wrap');
      var code = wrap ? wrap.querySelector('code') : null;
      if (!code) return;
      copyText(code.innerText).then(function () {
        button.classList.add('is-copied');
        button.textContent = 'Copiado';
        setTimeout(function () {
          button.classList.remove('is-copied');
          button.textContent = 'Copiar código';
        }, 1300);
      });
    });
  });

  var classSearch = document.querySelector('[data-class-search]');
  if (classSearch) {
    var cards = Array.from(document.querySelectorAll('.docs-class-card'));
    var sections = Array.from(document.querySelectorAll('.docs-class-section'));
    var categories = Array.from(document.querySelectorAll('[data-utility-category]'));
    var counter = document.querySelector('[data-class-count]');
    function runClassSearch() {
      var term = classSearch.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = ((card.getAttribute('data-class') || '') + ' ' + card.textContent).toLowerCase();
        var match = !term || text.indexOf(term) !== -1;
        card.classList.toggle('docs-hidden', !match);
        if (match) visible += 1;
      });
      sections.forEach(function (section) {
        var hasVisible = section.querySelector('.docs-class-card:not(.docs-hidden)');
        section.classList.toggle('docs-hidden', !hasVisible);
        if (term && hasVisible) section.open = true;
      });
      categories.forEach(function (category) {
        var hasVisibleGroup = category.querySelector('.docs-class-section:not(.docs-hidden)');
        category.classList.toggle('docs-hidden', !hasVisibleGroup);
      });
      if (counter) counter.textContent = visible + ' clases visibles';
    }
    classSearch.addEventListener('input', runClassSearch);
    runClassSearch();
  }

  var componentSearch = document.querySelector('[data-component-search]');
  if (componentSearch) {
    var componentSections = Array.from(document.querySelectorAll('.docs-component-section'));
    componentSearch.addEventListener('input', function () {
      var term = componentSearch.value.trim().toLowerCase();
      componentSections.forEach(function (section) {
        var text = section.textContent.toLowerCase();
        section.classList.toggle('docs-hidden', term && text.indexOf(term) === -1);
      });
    });
  }
})();

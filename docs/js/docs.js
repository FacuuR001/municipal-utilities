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

  function normalized(value) {
    return (value || '').toLowerCase().trim();
  }

  function slugify(value) {
    return normalized(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'seccion';
  }

  function setActive(buttons, activeButton) {
    buttons.forEach(function (button) {
      button.classList.toggle('is-active', button === activeButton);
    });
  }

  function dispatchInput(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }

  var copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="9" y="9" width="10" height="10" rx="2"></rect><path d="M5 15V7a2 2 0 0 1 2-2h8"></path></svg>';
  var checkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"></path></svg>';

  function setCopyIcon(button, copied) {
    button.innerHTML = copied ? checkIcon : copyIcon;
  }

  function prepareCopyButton(button, label) {
    var accessibleLabel = label || button.getAttribute('aria-label') || 'Copiar';
    button.setAttribute('aria-label', accessibleLabel);
    button.setAttribute('title', accessibleLabel);
    setCopyIcon(button, false);
  }

  function renderCopyState(button) {
    button.classList.add('is-copied');
    setCopyIcon(button, true);
    setTimeout(function () {
      button.classList.remove('is-copied');
      setCopyIcon(button, false);
    }, 1300);
  }

  function copyClassFromCode(code, button) {
    var className = (code.textContent || '').trim().replace(/^\./, '');
    if (!className) return;
    copyText(className).then(function () {
      renderCopyState(button);
    });
  }

  function initClassCopyButtons() {
    document.querySelectorAll('.docs-class-card').forEach(function (card) {
      if (card.querySelector('.docs-class-copy')) return;
      var code = card.querySelector('code');
      if (!code) return;

      var actions = document.createElement('div');
      actions.className = 'docs-class-card__top';

      var button = document.createElement('button');
      button.className = 'docs-class-copy';
      button.type = 'button';
      prepareCopyButton(button, 'Copiar clase ' + code.textContent.trim());

      code.parentNode.insertBefore(actions, code);
      actions.appendChild(code);
      actions.appendChild(button);

      button.addEventListener('click', function () {
        copyClassFromCode(code, button);
      });
    });

    document.querySelectorAll('.docs-chip-list code, .docs-inline-list code').forEach(function (code) {
      if (code.closest('.docs-copy-chip')) return;

      var wrapper = document.createElement('span');
      wrapper.className = 'docs-copy-chip';

      var button = document.createElement('button');
      button.className = 'docs-chip-copy';
      button.type = 'button';
      prepareCopyButton(button, 'Copiar ' + code.textContent.trim());

      code.parentNode.insertBefore(wrapper, code);
      wrapper.appendChild(code);
      wrapper.appendChild(button);

      button.addEventListener('click', function () {
        copyText((code.textContent || '').trim().replace(/^\./, '')).then(function () {
          renderCopyState(button);
        });
      });
    });
  }

  function syncUtilityCounts() {
    var cards = Array.from(document.querySelectorAll('.docs-class-card'));
    if (!cards.length) return;

    document.querySelectorAll('[data-class-count]').forEach(function (counter) {
      counter.textContent = cards.length + ' clases visibles';
    });

    var asideTotal = document.querySelector('.docs-hero__aside span:first-child strong');
    if (asideTotal) asideTotal.textContent = cards.length;

    document.querySelectorAll('[data-utility-category]').forEach(function (category) {
      var count = category.querySelectorAll('.docs-class-card').length;
      var groups = category.querySelectorAll('.docs-utility-group').length;
      var kicker = category.querySelector('.docs-utility-category-header .docs-kicker');
      if (kicker) {
        kicker.textContent = count + ' clases · ' + groups + (groups === 1 ? ' subsección' : ' subsecciones');
      }

      var navBadge = document.querySelector('.docs-utility-nav a[href="#' + category.id + '"] span');
      if (navBadge) navBadge.textContent = count;
    });

    document.querySelectorAll('.docs-utility-group').forEach(function (group) {
      var count = group.querySelectorAll('.docs-class-card').length;
      var kicker = group.querySelector('summary .docs-kicker');
      if (kicker) kicker.textContent = count + (count === 1 ? ' clase' : ' clases');
    });
  }

  function ensureId(element, base, index) {
    if (element.id) return element.id;
    var id = 'docs-' + slugify(base) + '-' + index;
    var originalId = id;
    var suffix = 2;
    while (document.getElementById(id)) {
      id = originalId + '-' + suffix;
      suffix += 1;
    }
    element.id = id;
    return id;
  }

  function initThemeToggle() {
    var topbar = document.querySelector('.docs-topbar');
    if (!topbar) return;

    var savedTheme = null;
    try { savedTheme = localStorage.getItem('docs-theme'); } catch (error) {}
    if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    var button = document.createElement('button');
    button.className = 'docs-theme-toggle';
    button.type = 'button';

    function render() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      button.innerHTML = '<span class="docs-theme-toggle__track"><span class="docs-theme-toggle__knob"></span></span><span class="docs-theme-toggle__label">' + (isDark ? 'Oscuro' : 'Claro') + '</span>';
    }

    button.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('docs-theme', 'light'); } catch (error) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('docs-theme', 'dark'); } catch (error) {}
      }
      render();
    });

    render();
    topbar.appendChild(button);
  }

  function collectSideNavItems() {
    var main = document.querySelector('.docs-main');
    if (!main) return [];

    var items = [];
    var seen = [];

    function addSection(section, label, type) {
      if (!section || seen.indexOf(section) !== -1 || !label) return null;
      seen.push(section);
      var id = ensureId(section, label, items.length + 1);
      var item = { id: id, label: label, type: type || 'section', element: section, children: [] };
      items.push(item);
      return item;
    }

    var hero = main.querySelector('.docs-hero');
    if (hero) addSection(hero, hero.querySelector('h1')?.textContent || 'Inicio', 'intro');

    Array.from(main.querySelectorAll('.docs-component-section, [data-utility-category], .docs-token-card, main > .docs-section')).forEach(function (section) {
      var title = section.querySelector(':scope > .docs-section-header h2, :scope > .docs-utility-category-header h2, :scope > h2') || section.querySelector('h2');
      var item = addSection(section, title ? title.textContent : '', section.matches('[data-utility-category]') ? 'category' : 'section');

      if (item && section.matches('[data-utility-category]')) {
        Array.from(section.querySelectorAll('.docs-utility-group')).forEach(function (group, index) {
          var heading = group.querySelector('summary h3');
          if (!heading) return;
          var label = heading.textContent.trim();
          var childId = ensureId(group, item.id + '-' + label, index + 1);
          item.children.push({ id: childId, label: label, element: group });
        });
      }
    });

    return items;
  }

  function initSideNav() {
    var items = collectSideNavItems();
    var header = document.querySelector('.docs-topbar');
    if (!header || items.length < 2) return;

    var aside = document.createElement('aside');
    aside.className = 'docs-side-nav';
    aside.setAttribute('aria-label', 'Índice lateral de secciones');

    var nav = document.createElement('nav');
    nav.className = 'docs-side-nav__body';
    nav.setAttribute('aria-label', 'Secciones de la página');

    var list = document.createElement('ul');
    list.className = 'docs-side-nav__list';
    var links = [];

    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'docs-side-nav__item';
      li.setAttribute('data-side-text', normalized(item.label + ' ' + item.children.map(function (child) { return child.label; }).join(' ')));

      var link = document.createElement('a');
      link.className = 'docs-side-nav__link docs-side-nav__link--' + item.type;
      link.href = '#' + item.id;
      link.textContent = item.label;
      link.setAttribute('data-side-link', item.id);
      li.appendChild(link);
      links.push(link);

      if (item.children.length) {
        var childList = document.createElement('ul');
        childList.className = 'docs-side-nav__children';
        item.children.forEach(function (child) {
          var childLi = document.createElement('li');
          childLi.className = 'docs-side-nav__child';
          childLi.setAttribute('data-side-text', normalized(child.label));
          var childLink = document.createElement('a');
          childLink.className = 'docs-side-nav__link docs-side-nav__link--child';
          childLink.href = '#' + child.id;
          childLink.textContent = child.label;
          childLink.setAttribute('data-side-link', child.id);
          childLi.appendChild(childLink);
          childList.appendChild(childLi);
          links.push(childLink);
        });
        li.appendChild(childList);
      }

      list.appendChild(li);
    });

    var filter = document.createElement('input');
    filter.className = 'docs-side-nav__filter';
    filter.type = 'search';
    filter.placeholder = 'Filtrar secciones';
    filter.setAttribute('aria-label', 'Filtrar secciones');

    var headerBlock = document.createElement('div');
    headerBlock.className = 'docs-side-nav__header';
    headerBlock.innerHTML = '<p class="docs-kicker">Secciones</p><h2>Índice</h2>';

    nav.appendChild(list);
    aside.appendChild(headerBlock);
    aside.appendChild(filter);
    aside.appendChild(nav);
    header.insertAdjacentElement('afterend', aside);
    document.body.classList.add('docs-has-sidebar');

    filter.addEventListener('input', function () {
      var term = normalized(filter.value);
      Array.from(list.children).forEach(function (item) {
        var parentText = item.getAttribute('data-side-text') || '';
        var children = Array.from(item.querySelectorAll('.docs-side-nav__child'));
        var parentMatch = !term || parentText.indexOf(term) !== -1;
        var childMatchCount = 0;

        children.forEach(function (child) {
          var childMatch = !term || parentMatch || (child.getAttribute('data-side-text') || '').indexOf(term) !== -1;
          child.classList.toggle('docs-hidden', !childMatch);
          if (childMatch) childMatchCount += 1;
        });

        item.classList.toggle('docs-hidden', !(parentMatch || childMatchCount > 0));
      });
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        links.forEach(function (item) { item.classList.toggle('is-active', item === link); });
      });
    });

    var observed = items.map(function (item) { return item.element; });
    items.forEach(function (item) {
      item.children.forEach(function (child) { observed.push(child.element); });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var activeId = entry.target.id;
          links.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('data-side-link') === activeId);
          });
        });
      }, { rootMargin: '-25% 0px -65% 0px', threshold: 0.01 });

      observed.forEach(function (section) { observer.observe(section); });
    }
  }

  initClassCopyButtons();
  syncUtilityCounts();
  initThemeToggle();
  initSideNav();

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    prepareCopyButton(button, button.getAttribute('aria-label') || 'Copiar código');

    button.addEventListener('click', function () {
      var wrap = button.closest('.docs-code-wrap');
      var code = wrap ? wrap.querySelector('code') : null;
      if (!code) return;
      copyText(code.innerText).then(function () {
        renderCopyState(button);
      });
    });
  });

  document.querySelectorAll('[data-clear-search]').forEach(function (button) {
    button.addEventListener('click', function () {
      var toolbar = button.closest('.docs-toolbar');
      var input = toolbar ? toolbar.querySelector('input[type="search"]') : document.querySelector('input[type="search"]');
      if (!input) return;
      input.value = '';
      var resetButton = toolbar ? toolbar.querySelector('[data-utility-filter="all"], [data-component-filter="all"]') : null;
      if (resetButton) resetButton.click();
      dispatchInput(input);
    });
  });

  document.querySelectorAll('[data-search-preset]').forEach(function (button) {
    button.addEventListener('click', function () {
      var input = document.querySelector('[data-class-search]');
      if (!input) return;
      input.value = button.getAttribute('data-search-preset') || '';
      dispatchInput(input);
    });
  });

  var classSearch = document.querySelector('[data-class-search]');
  if (classSearch) {
    var cards = Array.from(document.querySelectorAll('.docs-class-card'));
    var sections = Array.from(document.querySelectorAll('.docs-class-section'));
    var categories = Array.from(document.querySelectorAll('[data-utility-category]'));
    var counter = document.querySelector('[data-class-count]');
    var emptyState = document.querySelector('[data-class-empty]');
    var utilityButtons = Array.from(document.querySelectorAll('[data-utility-filter]'));
    var utilityScope = 'all';

    function runClassSearch() {
      var term = normalized(classSearch.value);
      var visible = 0;

      cards.forEach(function (card) {
        var category = card.closest('[data-utility-category]');
        var categoryId = category ? category.id : '';
        var inScope = utilityScope === 'all' || categoryId === utilityScope;
        var text = normalized((card.getAttribute('data-class') || '') + ' ' + card.textContent);
        var match = inScope && (!term || text.indexOf(term) !== -1);
        card.classList.toggle('docs-hidden', !match);
        if (match) visible += 1;
      });

      sections.forEach(function (section) {
        var hasVisible = section.querySelector('.docs-class-card:not(.docs-hidden)');
        section.classList.toggle('docs-hidden', !hasVisible);
        if (term && hasVisible) section.open = true;
      });

      categories.forEach(function (category) {
        var inScope = utilityScope === 'all' || category.id === utilityScope;
        var hasVisibleGroup = category.querySelector('.docs-class-section:not(.docs-hidden)');
        category.classList.toggle('docs-hidden', !(inScope && hasVisibleGroup));
      });

      if (counter) counter.textContent = visible + (visible === 1 ? ' clase visible' : ' clases visibles');
      if (emptyState) emptyState.classList.toggle('docs-hidden', visible > 0);
    }

    utilityButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        utilityScope = button.getAttribute('data-utility-filter') || 'all';
        setActive(utilityButtons, button);
        runClassSearch();
      });
    });

    document.querySelectorAll('[data-expand-utilities]').forEach(function (button) {
      button.addEventListener('click', function () {
        sections.forEach(function (section) {
          if (!section.classList.contains('docs-hidden')) section.open = true;
        });
      });
    });

    document.querySelectorAll('[data-collapse-utilities]').forEach(function (button) {
      button.addEventListener('click', function () {
        sections.forEach(function (section) {
          if (!section.classList.contains('docs-hidden')) section.open = false;
        });
      });
    });

    document.querySelectorAll('.docs-utility-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.querySelectorAll('.docs-utility-nav a').forEach(function (item) {
          item.classList.toggle('is-active', item === link);
        });
      });
    });

    classSearch.addEventListener('input', runClassSearch);
    runClassSearch();
  }

  var componentSearch = document.querySelector('[data-component-search]');
  if (componentSearch) {
    var componentSections = Array.from(document.querySelectorAll('.docs-component-section'));
    var componentButtons = Array.from(document.querySelectorAll('[data-component-filter]'));
    var componentCounter = document.querySelector('[data-component-count]');
    var componentEmpty = document.querySelector('[data-component-empty]');
    var componentIndexLinks = Array.from(document.querySelectorAll('.docs-component-index a'));
    var componentScope = 'all';

    function runComponentSearch() {
      var term = normalized(componentSearch.value);
      var visible = 0;

      componentSections.forEach(function (section) {
        var componentName = section.getAttribute('data-component') || '';
        var inScope = componentScope === 'all' || componentName === componentScope;
        var text = normalized(section.textContent + ' ' + componentName);
        var match = inScope && (!term || text.indexOf(term) !== -1);
        section.classList.toggle('docs-hidden', !match);
        if (match) visible += 1;
      });

      componentIndexLinks.forEach(function (link) {
        var target = (link.getAttribute('href') || '').replace('#', '');
        var section = target ? document.getElementById(target) : null;
        link.classList.toggle('docs-hidden', !!section && section.classList.contains('docs-hidden'));
      });

      if (componentCounter) componentCounter.textContent = visible + (visible === 1 ? ' componente visible' : ' componentes visibles');
      if (componentEmpty) componentEmpty.classList.toggle('docs-hidden', visible > 0);
    }

    componentButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        componentScope = button.getAttribute('data-component-filter') || 'all';
        setActive(componentButtons, button);
        runComponentSearch();
      });
    });

    componentSearch.addEventListener('input', runComponentSearch);
    runComponentSearch();
  }
})();

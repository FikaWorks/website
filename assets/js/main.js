const initMainMenu = function () {
  const menu = document.querySelector('.menu');
  const btn = menu.querySelector('button');
  const label = menu.querySelector('.menu-label');

  const menuToggle = function () {
    if (menu.querySelector('nav').classList.toggle('max-[1145px]:hidden')) {
      label.innerHTML = 'Menu';
    } else {
      label.innerHTML = 'Close';
    }

    menu.querySelector('.menu-icon-close').classList.toggle('hidden');
    menu.querySelector('.menu-icon-open').classList.toggle('hidden');
  };

  btn.addEventListener('click', menuToggle);
};

const initFilters = function () {
  const filter = document.querySelector('ul.filter-list');
  const filterBtn = document.getElementById('filter-btn');

  if (filterBtn) {
    const filterLabel = filterBtn.querySelector('.filter-label');
    const filterCount = filterBtn.querySelector('.filter-count');
    const items = filter.querySelectorAll('li');

    const filterToggle = function () {
      const isHidden = document
        .querySelector('ul.filter-list')
        .classList.toggle('hidden');
      const isDarkMode = document.documentElement.classList.contains('dark');

      if (isHidden) {
        // Closed state
        filterBtn.className = isDarkMode
          ? 'relative w-full cursor-default rounded-lg py-4 px-6 text-left border-2 focus:outline-none bg-gray-800 border-gray-600 text-white'
          : 'relative w-full cursor-default rounded-lg py-4 px-6 text-left border-2 focus:outline-none bg-white border-gray-800 text-black';
      } else {
        // Open state
        filterBtn.className = isDarkMode
          ? 'relative w-full cursor-default rounded-lg py-4 px-6 text-left border-2 focus:outline-none bg-white border-white text-black'
          : 'relative w-full cursor-default rounded-lg py-4 px-6 text-left border-2 focus:outline-none bg-black border-black text-white';
      }
    };

    filterBtn.addEventListener('click', filterToggle);

    items.forEach((li) => {
      li.addEventListener('click', function () {
        const clickedDataValue = this.dataset.value;
        const allFilterableItems = document.querySelectorAll('.filtered-item');

        if (clickedDataValue === '') {
          allFilterableItems.forEach((item) => {
            item.classList.remove('hidden');
          });
        } else {
          allFilterableItems.forEach((item) => {
            const shouldShow = item.classList.contains(
              'filtered-item-' + clickedDataValue
            );

            if (shouldShow) {
              item.classList.remove('hidden');
            } else {
              item.classList.add('hidden');
            }
          });
        }

        filterToggle();

        items.forEach((menu_item) => {
          filterLabel.innerHTML = this.dataset.label;
          filterCount.innerHTML = this.dataset.count;
          const isDarkMode =
            document.documentElement.classList.contains('dark');
          if (menu_item.dataset.value === clickedDataValue) {
            const fillColor = isDarkMode ? '#fff' : '#000';
            const strokeColor = isDarkMode ? '#000' : '#fff';
            menu_item.querySelector('svg').innerHTML =
              `<g clip-path="url(#single_select_selected_svg__a)"><rect x="4" y="4" width="16" height="16" rx="8" fill="${fillColor}"></rect><rect x="4" y="4" width="16" height="16" rx="8" stroke="${strokeColor}" stroke-width="2"></rect></g><rect x="1" y="1" width="22" height="22" rx="11" stroke="${fillColor}" stroke-width="2"></rect><defs><clipPath id="single_select_selected_svg__a"><rect width="24" height="24" rx="12" fill="${strokeColor}"></rect></clipPath></defs>`;
          } else {
            const fillColor = isDarkMode ? '#374151' : '#fff';
            const strokeColor = isDarkMode ? '#4b5563' : '#BDBDBD';
            menu_item.querySelector('svg').innerHTML =
              `<rect x="1" y="1" width="22" height="22" rx="11" fill="${fillColor}"></rect><rect x="1" y="1" width="22" height="22" rx="11" stroke="${strokeColor}" stroke-width="2"></rect>`;
          }
        });
      });
    });
  }
};

const initForms = function () {
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    form.querySelector('.form-success').classList.add('hidden');
    form.querySelector('.form-failed').classList.add('hidden');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() =>
        form.querySelector('.form-success').classList.remove('hidden')
      )
      .catch(() =>
        form.querySelector('.form-failed').classList.remove('hidden')
      );
  };

  document
    .querySelectorAll('form')
    .forEach((f) => f.addEventListener('submit', handleSubmit));
};

const initTimelineCurve = function () {
  const container = document.getElementById('timeline-container');
  const svg = document.getElementById('timeline-curve');
  if (!container || !svg) return;

  const wrapper = svg.parentElement; // The centered wrapper div (col-start-2 col-end-12)

  const draw = function () {
    wrapper.querySelectorAll('.timeline-dot').forEach((el) => el.remove());

    const steps = container.querySelectorAll('[data-timeline-step]');
    if (steps.length === 0 || window.innerWidth < 1024) {
      svg.innerHTML = '';
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.width / 2;

    const points = Array.from(steps).map((step, index) => {
      const stepRect = step.getBoundingClientRect();
      const innerBlock = step.querySelector(':scope > div');
      const innerRect = innerBlock.getBoundingClientRect();
      const y = stepRect.top + stepRect.height / 2 - rect.top;
      const isLeft = index % 2 === 0;

      let x;
      if (isLeft) {
        x = innerRect.right - rect.left;
      } else {
        x = innerRect.left - rect.left;
      }

      return { x, y, colorClass: step.dataset.color };
    });

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const distY = p2.y - p1.y;
      const cp1 = { x: p1.x, y: p1.y + distY * 0.5 };
      const cp2 = { x: p2.x, y: p2.y - distY * 0.5 };
      d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
    }

    svg.setAttribute('width', rect.width);
    svg.setAttribute('height', rect.height);
    svg.innerHTML = `<path d="${d}" stroke="#d1c6b3" stroke-width="3" stroke-opacity="1" stroke-dasharray="6 6" fill="none" stroke-linecap="round" />`;

    points.forEach((p, i) => {
      const dot = document.createElement('div');
      dot.className = `timeline-dot ${p.colorClass}`;
      dot.textContent = (i + 1).toString().padStart(2, '0');
      dot.style.left = `${p.x}px`;
      dot.style.top = `${p.y}px`;
      wrapper.appendChild(dot);
    });
  };

  requestAnimationFrame(() => {
    draw();
    setTimeout(draw, 500);
  });

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 150);
  });
};

const initThemeToggle = function () {
  const toggles = document.querySelectorAll('.theme-toggle-btn');
  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof window.toggleTheme === 'function') {
        window.toggleTheme();
      }
    });
  });
};

const toggleTheme = function () {
  const html = document.documentElement;
  const isDarkMode = html.classList.toggle('dark');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

window.toggleTheme = toggleTheme;

window.addEventListener('load', function () {
  initMainMenu();
  initFilters();
  initForms();
  initTimelineCurve();
  initThemeToggle();
});

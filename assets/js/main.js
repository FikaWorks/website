const initMainMenu = function () {
  const menu = document.querySelector('.menu');
  const btn = menu.querySelector('button');
  const label = menu.querySelector('.menu-label');

  const menuToggle = function () {
    if (menu.querySelector('nav').classList.toggle('max-lg:hidden')) {
      kabel.innerHTML = 'Menu';
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
      if (document.querySelector('ul.filter-list').classList.toggle('hidden')) {
        filterBtn.classList =
          'relative w-full cursor-default rounded-lg py-4 px-6 text-left border-2 focus:outline-none bg-white border-gray-800 text-black';
      } else {
        filterBtn.classList =
          'relative w-full cursor-default rounded-lg py-4 px-6 text-left border-2 focus:outline-none bg-black border-black text-white';
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
          if (menu_item.dataset.value === clickedDataValue) {
            menu_item.querySelector('svg').innerHTML =
              '<g clip-path="url(#single_select_selected_svg__a)"><rect x="4" y="4" width="16" height="16" rx="8" fill="#000"></rect><rect x="4" y="4" width="16" height="16" rx="8" stroke="#fff" stroke-width="2"></rect></g><rect x="1" y="1" width="22" height="22" rx="11" stroke="#000" stroke-width="2"></rect><defs><clipPath id="single_select_selected_svg__a"><rect width="24" height="24" rx="12" fill="#fff"></rect></clipPath></defs>';
          } else {
            menu_item.querySelector('svg').innerHTML =
              '<rect x="1" y="1" width="22" height="22" rx="11" fill="#fff"></rect><rect x="1" y="1" width="22" height="22" rx="11" stroke="#BDBDBD" stroke-width="2"></rect>';
          }
        });
      });
    });
  }
};

window.addEventListener('load', function () {
  initFilters();
  initMainMenu();
});

(function () {
  'use strict';

  angular
    .module('standards')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Edit Standards',
      state: 'edit-standards'
    });

  }
})();

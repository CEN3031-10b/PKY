(function () {
  'use strict';

  angular
    .module('info')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Information',
      state: 'info',
      type: 'dropdown',
      roles: ['admin', 'user']
    });
	
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Instructions',
      state: 'info.1'
    });
  }
})();

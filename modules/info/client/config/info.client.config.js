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

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Accessing the Test',
      state: 'info.2'
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Signing In',
      state: 'info.3'
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Test Features',
      state: 'info.4'
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Question Types',
      state: 'info.5'
    });

  }
})();

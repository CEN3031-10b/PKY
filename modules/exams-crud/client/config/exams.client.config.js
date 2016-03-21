(function () {
  'use strict';

  angular
    .module('exams')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
	/*
    Menus.addMenuItem('topbar', {
      title: 'Exams',
      state: 'edit-exams',
      type: 'dropdown',
      roles: ['admin']
    });
	*/
	
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Edit Exams',
      state: 'edit-exams'
    });

  }
})();

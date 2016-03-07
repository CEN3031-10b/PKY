(function () {
  'use strict';

  angular
    .module('exams-take')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
	/*
    Menus.addMenuItem('topbar', {
      title: 'Practice Exams',
      state: 'exams-take',
	  type: 'dropdown',
      roles: ['user','admin']
    });
	
	Menus.addSubMenuItem('topbar', 'exams-take', {
      title: 'select exam',
      state: 'exams-take.select'
    });
	*/

  }
})();

(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item to admin
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'View Student Attempts',
      state: 'exams-analysis.admin'
    });
  }
})();

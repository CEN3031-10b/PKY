(function () {
  'use strict';

  angular
    .module('standards.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('edit-standards', {
		parent: 'admin',
		url: '/standards/edit',
        templateUrl: 'modules/exams-standards/client/views/edit-standards.client.view.html',
		controller: 'EditStandardsController',
		resolve:{
			standards: function(ExamsService){
				return ExamsService.get_standards();
			}
		}
      });
  }

})();

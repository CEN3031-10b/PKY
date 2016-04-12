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
      })
	  .state('view-standards', {
		parent: 'info',
		url: '/standards/view',
        templateUrl: 'modules/exams-standards/client/views/view-standards.client.view.html',
		controller: 'ViewStandardsController',
		resolve:{
			standards: function(ExamsService){
				return ExamsService.get_standards();
			}
		}
      });
  }

})();

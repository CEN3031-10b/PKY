(function () {
  'use strict';

  angular
    .module('exams-take.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('exams-take', {
		url: '/exams',
		abstract: true,
		template: '<ui-view></ui-view>'
      })		
      .state('exams-take.select', {
		parent: 'exams-take',
		url: '/select',
        templateUrl: 'modules/exams-take/client/views/select-exam.client.view.html',
		controller: 'SelectExamController',
		resolve:{
			exams: function(ExamsService){
				// returns exams without questions or answers populated
				return ExamsService.get_exams();
			}
		}
      })
      .state('exams-take.take', {
		parent: 'exams-take',
		url:'/:eID',
        templateUrl: 'modules/exams-take/client/views/take-exam.client.view.html',
        controller: 'TakeExamController',
      });
  }

})();

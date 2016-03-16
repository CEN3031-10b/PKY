(function () {
  'use strict';

  angular
    .module('exams-analysis.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider	
      .state('exams-analysis', {
		url: '/review/attempt',
		abstract: true,
		template: '<ui-view></ui-view>'
      })	
      .state('exams-analysis.single', {
		parent: 'exams-analysis',
		url: '/:aID',
        templateUrl: 'modules/exams-analysis/client/views/review-single-attempt.client.view.html',
		controller: 'ReviewAttemptController',
		resolve:{
			Attempt: function(ExamsAnalysisService, $stateParams){
				return ExamsAnalysisService.get_attempt($stateParams.aID);
			}
		},
      })
	  .state('exams-analysis.admin', {
		parent: 'exams-analysis',
        templateUrl: 'modules/exams-analysis/client/views/review-admin-attempts.client.view.html',
		controller: 'AdminAttemptController',
		resolve:{
			AllAttempts: function(ExamsAnalysisService){
				return ExamsAnalysisService.get_all_attempts();
			}
		},
      });
  }

})();

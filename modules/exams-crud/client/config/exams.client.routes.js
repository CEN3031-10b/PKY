(function () {
  'use strict';

  angular
    .module('exams.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('edit-exams', {
		parent: 'admin',
		url: '/exams/edit',
        templateUrl: 'modules/exams-crud/client/views/edit-exams.client.view.html',
		controller: 'EditExamsController',
		resolve:{
			exams: function(ExamsService){
				return ExamsService.get_exams();
			}
		}
      })
      .state('edit-exams.single', {
		url:'/:exam_id',
		parent: 'edit-exams',
        templateUrl: 'modules/exams-crud/client/views/edit-single-exam.client.view.html',
        controller: 'EditSingleExamController',
		resolve:{
			exam: function(ExamsService, $stateParams){
				if(!$stateParams.exam_id){
					return null;
				}
				return ExamsService.get_exam($stateParams.exam_id);
			}
		}
      });
  }

})();

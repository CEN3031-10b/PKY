(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('SelectExamController', SelectExamController);

  SelectExamController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'ExamsAnalysisService', 'Authentication', '$uibModal', 'exams'];

  function SelectExamController($scope, $rootScope, $state, $stateParams, ExamsService, ExamsAnalysisService, Authentication, $uibModal, exams) {

	$scope.exams = exams.data;
	$scope.attempts = [];
	
	ExamsAnalysisService.get_attempts()
	.then(function(response){
		$scope.attempts = response.data;
	}, function(error){

	});
	
	$scope.start_exam = function(_exam){
		$state.go('exams-take.take', {'eID':_exam._id,'exam':_exam});
	};
	
	$scope.delete_attempt = function(_attempt){
		ExamsAnalysisService.delete_attempt(_attempt._id)
		.then(function(response){
			$scope.attempts.splice($scope.attempts.indexOf(_attempt),1);
		}, function(error){
			console.log(error);
		});
	};
	
  }
  
})();

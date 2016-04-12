(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddExamController', AddExamController);

  AddExamController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance','old_exam'];

  function AddExamController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, old_exam) {

    $scope.exam = {};
	$scope.alert = null;
	$scope.old_exam = old_exam;
	$scope.loading = false;
	
	// edit mode
	if(old_exam){
		$scope.exam = JSON.parse(JSON.stringify(old_exam));
	}
	
	// TODO: info endpoint
    $scope.classes = ['Algebra 1', 'Algebra 2'];
	
	$scope.submit = function(){
		$scope.loading = true;
		if(old_exam){
			ExamsService.update_exam($scope.exam)
			.then(function(response){
				old_exam.title = response.data.title;
				old_exam.allotted_time = response.data.allotted_time;
				old_exam.allowed_attempts = response.data.allowed_attempts;
				old_exam.class =  response.data.class;
				$uibModalInstance.close(response.data);
				$scope.loading = false;
			}, function(error){
				$scope.loading = false;
				//TODO
			});
			
			return;
		}
	
		ExamsService.create_exam($scope.exam)
		.then(function(response){
			$uibModalInstance.close(response.data);
			$scope.loading = false;
		}, function(error){
			$scope.loading = false;
			//TODO
		});
	};
	
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    window.onpopstate = function(event) {
      $uibModalInstance.close();
    };
	
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
	
  }
  
})();

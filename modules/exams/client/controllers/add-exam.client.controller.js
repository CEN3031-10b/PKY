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
	
	// edit mode
	if(old_exam){
		$scope.exam = JSON.parse(JSON.stringify(old_exam));
	}
	
	// TODO: info endpoint
    $scope.classes = ['Algebra 1', 'Algebra 2'];
	
	$scope.submit = function(){
		
		if(old_exam){
			ExamsService.update_exam($scope.exam)
			.then(function(response){
				old_exam.class = response.data.class;
				old_exam.title = response.data.title;
				$uibModalInstance.close(response.data);
			}, function(error){
				//TODO
			});
			
			return;
		}
	
		ExamsService.create_exam($scope.exam)
		.then(function(response){
			$uibModalInstance.close(response.data);
		}, function(error){
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

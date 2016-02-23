(function () {
  'use strict';

  angular
    .module('exams')
    .controller('EditExamsController', EditExamsController);

  EditExamsController.$inject = ['$scope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','exams'];

  function EditExamsController($scope, $state, $stateParams, ExamsService, Authentication, $uibModal,exams) {

	// init child state with no parameters
	$state.go('edit-exams.single');

	// get data from resolve
	$scope.exams = exams.data;
	
	// init then find class type vars
	$scope.class_types = [];
	$scope.selected_class_type = null;
	
	// find unique class types
	for(var i = 0; i < $scope.exams.length; ++i){
		if($scope.class_types.indexOf($scope.exams[i].class) == -1){
			$scope.class_types.push($scope.exams[i].class);
		}
	}

	$scope.add_exam = function(){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams/client/views/add-exam.client.view.html',
        controller: 'AddExamController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_exam: function(){
			return null;
		  }
        }
      });
	  
      modalInstance.result.then(function (result) {
      }, function () {
		  
      });
	};
	
	if($scope.class_types){
		$scope.selected_class_type = $scope.class_types[0];
	}
	
	// used to select tab
	$scope.activate_tab = function(_exam){
		for(var i = 0; i < $scope.exams.length; ++i){
			$scope.exams[i].active = false;
		}
		if(_exam){
			_exam.active = true;
			$state.go('edit-exams.single',{exam_id: _exam._id});
		}
	};	
	
	// init all tabs inactive
	$scope.activate_tab();
	
  }
  
})();

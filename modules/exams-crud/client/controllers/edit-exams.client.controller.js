(function () {
  'use strict';

  angular
    .module('exams')
    .controller('EditExamsController', EditExamsController);

  EditExamsController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','$templateCache','exams'];

  function EditExamsController($scope,$rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal,$templateCache,exams) {

	$scope.load = false;
  
	// init child state with no parameters
	$state.go('edit-exams.single');

	// get data from resolve
	$scope.exams = exams.data;
	for(var i = 0; i < $scope.exams.length; ++i){
		$scope.exams[i].active = false;
	}
	
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
        templateUrl: '/modules/exams-crud/client/views/add-exam.client.view.html',
        controller: 'AddExamController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_exam: function(){
			return null;
		  }
        }
      });
	  
		modalInstance.result.then(
			// exam was added to db, returned as _exam
			function (_exam) {
			  if(_exam){
				$scope.exams.unshift(_exam);
			  }
		});
	  
	};
	
	if($scope.class_types){
		$scope.selected_class_type = $scope.class_types[0];
	}	
	
	$scope.set_tab = function(exam_id){
		for(var i = 0; i < $scope.exams.length; ++i){		
			$scope.exams[i].active = (exam_id === $scope.exams[i]._id);				
		}
	};
	
	// used to select tab
	$scope.activate_tab = function(_exam){
		for(var i = 0; i < $scope.exams.length; ++i){
			$scope.exams[i].active = false;
		}
		if(_exam){
			$scope.load = true;
			_exam.active = true;
			$state.go('edit-exams.single', {exam_id: _exam._id})
			.then(function(){
				$scope.load = false;
			});
		}
	};	
	
  }
  
})();

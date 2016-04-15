(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('SelectExamController', SelectExamController);

  SelectExamController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'ExamsAnalysisService', 'Authentication', '$uibModal', 'exams'];

  function SelectExamController($scope, $rootScope, $state, $stateParams, ExamsService, ExamsAnalysisService, Authentication, $uibModal, exams) {

	$scope.exams = exams.data;
	$scope.attempts = [];
	$scope.error = null;
	$scope.selected_mode = "take";
	
	// from edit exams page
	$scope.calculate_points = function(_exam){
		_exam.point_total = 0;
		for(var i = 0; i <_exam.questions.length; ++i){
			if(_exam.questions[i].points != null){
				_exam.point_total += Number(_exam.questions[i].points);
			}
			else{
				_exam.point_total = 'One or more questions with undefined point value.';
				break;
			}
		}
	};	
	
	// set point_total attribute of each exam
	for(var i = 0; i < $scope.exams.length; ++i){
		$scope.calculate_points($scope.exams[i]);
	}

	$scope.calculate_remaining_attempts = function(_attempts, _exams){
		for(var i = 0; i < _exams.length; ++i){
			_exams[i].remaining_attempts = _exams[i].allowed_attempts;
			for(var j = 0; j < _attempts.length; ++j){
				if(_exams[i]._id === _attempts[j].exam._id && _attempts[j].submitted){
					_exams[i].remaining_attempts--;
				}
			}
		}
	};
	
	ExamsAnalysisService.get_attempts()
	.then(function(response){
		$scope.attempts = response.data;
		$scope.calculate_remaining_attempts($scope.attempts, $scope.exams); 
	}, function(error){
		$scope.error = error;
	});
	
	$scope.start_exam = function(_exam){
		$state.go('exams-take.take', {'eID':_exam._id});
	};
	$scope.review_attempt = function(_attempt){
		$state.go('exams-analysis.single', {'aID':_attempt._id});
	};
	
	$scope.delete_attempt = function(_attempt){
		ExamsAnalysisService.delete_attempt(_attempt._id)
		.then(function(response){
			$scope.attempts.splice($scope.attempts.indexOf(_attempt),1);
		}, function(error){
			$scope.error = error;
			console.log(error);
		});
	};
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('EditSingleExamController', EditSingleExamController);

  EditSingleExamController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModal', 'exam'];

  function EditSingleExamController($scope,$rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, exam) {
	
	$scope.exam = null;
	$scope.load = false;
	$scope.loading = false;
	$scope.loading_question = false;
	
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
	
	if(exam){
		$scope.exam = exam.data;
		$scope.set_tab($scope.exam._id); // for reloading the page while editing an exam
		$scope.calculate_points($scope.exam);
	}

	$scope.delete_exam = function(_exam){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '/modules/exams-crud/client/views/prompt-yes-no.client.view.html',
			controller: 'PromptController',
			windowClass: 'prompt-modal',
			size: 'lg',
			resolve: {
				question: function(){
					return null;
				},
				string_header: function(){
					return 'Are you sure you want to premanantly delete ' + _exam.title + '?';
				},
				old_exam: function(){
					return _exam;
				}
			}
		  });
		  
		modalInstance.result.then(
		function (yes) {
		  // question deletion confirmed
		  if(yes){
			$scope.loading = true;
			ExamsService.delete_exam(_exam._id)
			.then(function(response){
				$state.go('edit-exams', {}, {reload: true});
			}, function(error){
				$scope.loading = false;
			});
		  }
		});
	};
 
	$scope.delete_question = function(_exam, _question){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '/modules/exams-crud/client/views/prompt-yes-no.client.view.html',
			controller: 'PromptController',
			windowClass: 'prompt-modal',
			size: 'lg',
			resolve: {
				question: function(){
					return _question;
				},
				string_header: function(){
					return 'Are you sure you want to premanantly delete this question?';
				},
				old_exam: function(){
					return null;
				}
			}
		});

	  modalInstance.result.then(
	  function (yes) {
		  // question deletion confirmed
		  if(yes){
			_question.loading = true;
			ExamsService.remove_question(_exam, _question._id)
			.then(function(response){
				
				// increment version (incremented on server during success response)
				_exam.version++;
				// remove question from array
				_exam.questions.splice(_exam.questions.indexOf(_question), 1);
				$scope.calculate_points(_exam);
			}, function(error){
				//TODO, display error
				_question.loading = false;
			});
		  }
	  });
	};

	$scope.edit_exam = function(_exam){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-crud/client/views/add-exam.client.view.html',
        controller: 'AddExamController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_exam: function(){
			return _exam;
		  }
        }
        });
	  
		modalInstance.result.then(
		function (edited_exam) {
		  // question deletion confirmed
		  if(edited_exam){
			  for(var i = 0; i < $scope.exams.length; ++i){
				  if($scope.exams[i]._id === edited_exam._id){
					  $scope.exams[i] = edited_exam;
					  $scope.activate_tab($scope.exams[i]);
					  break;
				  }
			  }
		  }
		});
	};

	$scope.add_question_to_exam = function (_exam) {	
		var modalInstance = $uibModal.open({
		animation: true,
		templateUrl: '/modules/exams-crud/client/views/add-question.client.view.html',
		controller: 'AddQuestionController',
		windowClass: 'add-question-modal',
		size: 'lg',
		resolve: {
			selected_exam: function () {
					return _exam;
				},
			old_question: function(){
					return null;
				},
			standards: function(ExamsService){
				return ExamsService.get_standards();
			}
		}
		});
	
		modalInstance.result.then(
		function(){
			$scope.calculate_points(_exam);
		});
	
    };
	
	$scope.edit_question = function(_exam, _question){
		var modalInstance = $uibModal.open({
		animation: true,
		templateUrl: '/modules/exams-crud/client/views/add-question.client.view.html',
		controller: 'AddQuestionController',
		windowClass: 'add-question-modal',
		size: 'lg',
		resolve: {
			selected_exam: function () {
				return _exam;
			},
			old_question: function(){
				return _question;
			},
			standards: function(ExamsService){
				return ExamsService.get_standards();
			}
		}
		});
	  
		modalInstance.result.then(
		function(){
			$scope.calculate_points(_exam);
		});
	  
	};
	
  }
  
})();

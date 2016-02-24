(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddQuestionController', AddQuestionController);

  AddQuestionController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModalInstance','selected_exam','old_question'];

  function AddQuestionController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, selected_exam,old_question) {
    
	$scope.selected_exam = selected_exam;
	$scope.selected_type = null;
	$scope.question = {};
	$scope.question.answers = [];
	$scope.question.exam = selected_exam._id;
	$scope.alert = {};
	
	// edit mode
	if(old_question){
		// copy hack to prevent question from changing beneath modal
		$scope.selected_type = old_question.type;
		$scope.question = JSON.parse(JSON.stringify(old_question));
	}
  
    $scope.add_new_mc_answer = function(){
      $scope.question.answers.push({
        content: '',
        correct: false,
      });
    };
	
	$scope.select_mc_answer = function(index){
		if($scope.question && $scope.question.answers){
			for(var i = 0; i < $scope.question.answers.length; ++i){
				$scope.question.answers[i].correct = (i==index);
			}
		}
	};
  
    $scope.remove_mc_answer = function(index){
      $scope.question.answers.splice(index, 1);  
    };
  
    $scope.submit = function(){
	// if edit mode, update question
	if(old_question){
		ExamsService.update_question($scope.question)
		.then(function(response){
			// update old question which is a reference to the question being edited	
			old_question.content = response.data.content;
			old_question.answers = response.data.answers;
			old_question.type = response.data.type;
			
			$scope.ok();
        }, function(error){
			if(error.data && error.data.message)
			$scope.set_alert(error.data.message);
        });
		
		return;
	}
		
	// add question, associate with test  
      ExamsService.create_question($scope.question)
        .then(function(response){
			selected_exam.questions.push(response.data);
			$scope.ok();
        }, function(error){
			if(error.data && error.data.message)
			$scope.set_alert(error.data.message);
        });
    };

	$scope.set_alert = function(msg){
		$scope.alert.message = msg;
		$scope.alert.show = true;
	}
	
	$scope.clear_alert = function(){
		$scope.alert.show = false;
	}
	
	$scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
	
  }
  
})();

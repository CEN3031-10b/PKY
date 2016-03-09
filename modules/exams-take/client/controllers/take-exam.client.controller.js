(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('TakeExamController', TakeExamController);

  TakeExamController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal'];

  function TakeExamController($scope,$rootScope, $state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal) {
	
	if(!$stateParams.exam){
		$state.go('exams-take.select');
	}
	
	// init 
	$scope.exam = $stateParams.exam;
	$scope.attempt = {};	

	// create a new attempt or return one in progress for the specified exam
	ExamsAnalysisService.create_attempt($scope.exam._id)
	.then(function(response){
		$scope.attempt = response.data;
		$scope.set_answers($scope.attempt);
	}, function(error){
		console.log(error);
	});
	
	$scope.save_mc_answer = function(_question, _answer){
		
		// only call this function on multiple choice questions
		if(_question.type !== 'multiple choice'){
			return;
		}

		// remove previous answers for this question
		$scope.attempt.student_answers = $scope.attempt.student_answers.filter(function(sa){
			return sa.question_id !== _question._id;
		});

		// add the selected answer
		$scope.attempt.student_answers.push({
			'question_id': _question._id,
			'answer_id': _answer._id,
			'correct': true
		});
		
		// save the question in the attempt
		ExamsAnalysisService.save_answers($scope.attempt)
		.then(function(response){
			$scope.attempt = response.data;
			$scope.set_answers($scope.attempt);
		}, function(error){
			console.log(error);
		});
		
	};
	
	// populate view with previous answers
	$scope.set_answers = function(_attempt){
		for(var i = 0; i < _attempt.questions.length; ++i){
			for(var j = 0; j < _attempt.student_answers.length; ++j){
				// multiple choice
				if(_attempt.questions[i].data.type === 'multiple choice' 
				&& _attempt.student_answers[j].question_id === _attempt.questions[i].data._id){
					for(var k = 0; k < _attempt.questions[i].data.answers.length; ++k){
						if(_attempt.questions[i].data.answers[k]._id === _attempt.student_answers[j].answer_id){
							_attempt.questions[i].selected_answer = _attempt.questions[i].data.answers[k]._id;
						}
					}
				}
			}
		}
	};
	
	$scope.submit_attempt = function(){
		ExamsAnalysisService.submit_attempt($scope.attempt)
		.then(function(response){
			$state.go('exams-take.select');
		}, function(error){
			console.log(error);
		});
	};
	
  }
  
})();

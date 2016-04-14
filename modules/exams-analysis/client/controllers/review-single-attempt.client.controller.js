(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .controller('ReviewAttemptController', ReviewAttemptController);

  ReviewAttemptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$uibModal', 'Attempt'];

  function ReviewAttemptController($scope, $rootScope, $state, $stateParams, Authentication, $uibModal, Attempt) {
	$scope.attempt = Attempt.data;
	$scope.multiple_choice = 'multiple choice';
	$scope.multiple_select = 'multiple select';
	$scope.fill_in_the_blank = 'fill in the blank';

	// populate view with attempt answers
	$scope.set_answers = function(_attempt){
		for(var i = 0; i < _attempt.questions.length; ++i){
			for(var j = 0; j < _attempt.student_answers.length; ++j){
				if(_attempt.student_answers[j].question_id === _attempt.questions[i].data._id){
					for(var k = 0; k < _attempt.questions[i].data.answers.length; ++k){
						if(_attempt.questions[i].data.answers[k]._id === _attempt.student_answers[j].answer_id){
							if(_attempt.questions[i].data.type === $scope.multiple_choice){
								_attempt.questions[i].selected_answer = _attempt.questions[i].data.answers[k]._id;
								_attempt.questions[i].data.answers[k].correct = _attempt.student_answers[j].correct;								
							}
							else if(_attempt.questions[i].data.type === $scope.multiple_select){
								_attempt.questions[i].data.answers[k].correct = _attempt.student_answers[j].correct;
							}
							else if(_attempt.questions[i].data.type === $scope.fill_in_the_blank){
								_attempt.questions[i].data.answers[k].value = _attempt.student_answers[j].value;
								_attempt.questions[i].data.answers[k].content = _attempt.student_answers[j].content;
							}
						}					
					}
				}
			}
		}
	};
	
	$scope.set_answers($scope.attempt);
	
	$scope.get_alert_type = function(_question){
		if(_question.points_earned != _question.data.points){
			return "danger";
		}
		return "success";
	};
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('TakeExamController', TakeExamController);

  TakeExamController.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal'];

  function TakeExamController($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal) {
	
	// init 
	$scope.attempt = {};	
	$scope.multiple_choice = 'multiple choice';
	$scope.multiple_select = 'multiple select';
	$scope.fill_in_the_blank = 'fill in the blank';
	$scope.loading = true;
	$scope.error = null;
	$scope.currentPage = 0; //Page numbering starts at 0-- view displays "currentPage+1" so that users see pages starting at page # 1
	$scope.arrayIndx = 0;

	//makes the order for the exam questions
	$scope.examOrder = [];
	for(var h = 0; h <= 6 - 1; h++){
		$scope.examOrder.push(h);
	}
    for (var i = $scope.examOrder.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = $scope.examOrder[i];
        $scope.examOrder[i] = $scope.examOrder[j];
        $scope.examOrder[j] = temp;
    }

    $scope.indx = $scope.examOrder[$scope.arrayIndx];

	$scope.numberOfPages = function() {
			return $scope.attempt.questions.length;
	};

	// create a new attempt or return one in progress for the specified exam
	ExamsAnalysisService.create_attempt($stateParams.eID)
	.then(function(response){
		$scope.loading = false;
		$scope.attempt = response.data;
		$scope.set_answers($scope.attempt);
	}, function(error){
		$scope.loading = false;
		$scope.error = error;
	});
	
	$scope.save_attempt = function(){
		$scope.loading = true;
		ExamsAnalysisService.save_answers($scope.attempt)
		.then(function(response){
			$scope.loading = false;
			$scope.attempt = response.data;
			$scope.set_answers($scope.attempt);
		}, function(error){
			$scope.loading = false;
			$scope.error = error;
		});
	};
	
	$scope.save_answer = function(_question,_answer){

		// filter previous answers, multiple choice should only have one answer per question
		// this will be validated on server side
		$scope.attempt.student_answers = $scope.attempt.student_answers.filter(function(sa){
			return sa.answer_id !== _answer._id && (_question.type !== $scope.multiple_choice || sa.question_id !== _question._id);
		});

		// add the selected answer
		$scope.attempt.student_answers.push({
			'question_id': _question._id,
			'answer_id': _answer._id,
			'is_numeric': _answer.is_numeric || false,
			'value': _answer.value,
			'content': _answer.content,
			'correct': _answer.correct,
		});
	
		$scope.save_attempt();
	};

	// populate view with previous answers
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
	
	$scope.submit_attempt = function(){
		$scope.loading = true;
		ExamsAnalysisService.submit_attempt($scope.attempt)
		.then(function(response){
			$state.go('exams-take.select');
		}, function(error){
			$scope.loading = false;
			$scope.error = error;
		});
	};

	//navigate to previous question
		$scope.previousQuestion = function() {

				if($scope.arrayIndx <= 0){
					return;
				}	
				$scope.arrayIndx -= 1;
				$scope.indx = $scope.examOrder[$scope.arrayIndx];
		};
		
		//navigate to previous question
		$scope.nextQuestion = function() {

				if($scope.arrayIndx >= $scope.attempt.questions.length - 1){
					return;
				}	
				$scope.arrayIndx += 1;
				$scope.indx = $scope.examOrder[$scope.arrayIndx];
				console.log($scope.attempt.questions.length);
		};



	$scope.open_calculator = function(){
		//$window.open('/modules/calculator/client/views/calculator.view.html#');
		//$window.location.href = ('/modules/calculator/client/views/calculator.view.html');
		
		  var modalInstance = $uibModal.open({
			animation: true,
			template: '<iframe src="/modules/calculator/client/views/calculator.view.html" width="350" height="400"></iframe>',
			size: 'md'
		  });	
	};
}
  
})();

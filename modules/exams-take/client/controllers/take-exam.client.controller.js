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
	$scope.loading = false;
	$scope.init_loading = true;
	$scope.error = null;
	$scope.calc_opened = false;
	$scope.notepad_opened = false;
	$scope.formula_opened = false;
	// $scope.currentPage = 0; //Page numbering starts at 0-- view displays "currentPage+1" so that users see pages starting at page # 1
	// indx is a basically a counter for question number. That way you can jump from question 1 to 5 by knowing where in the question array
	// the desired quesion is. It replaces the need for currentPage
	$scope.indx = 0;
	
	//timer stuff
	$scope.percent_remaining = 0;
	$scope.time_remaining = $scope.attempt.exam_allotted_time;

	var timer = setInterval(function(){ 
		var currentDate = new Date().getTime();
		var startTime = Date.parse($scope.attempt.start_time);
		var endTime = $scope.attempt.exam_allotted_time;
		var timeElasped = Math.abs((currentDate - startTime))/60000;
		$scope.$apply(function(){
			$scope.time_remaining = endTime-Math.floor(timeElasped);
			$scope.percent_remaining = Math.abs($scope.time_remaining)/endTime*100;
			if ($scope.percent_remaining>100 || $scope.time_remaining < 0) {
				$scope.percent_remaining = 100;
				$scope.time_remaining = 0;
				clearInterval(timer);
				//Throws the alert that time is up to the user
				$scope.time_out();
			}
		});
	}, 1000);

    $scope.random = function() {
        return 0.5 - Math.random();
    }

	$scope.numberOfPages = function() {
			return $scope.attempt.questions.length;
		};

	// create a new attempt or return one in progress for the specified exam
	ExamsAnalysisService.create_attempt($stateParams.eID)
	.then(function(response){
		$scope.init_loading = false;
		$scope.attempt = response.data;
		$scope.set_answers($scope.attempt);
	}, function(error){
		$scope.init_loading = false;
		$scope.error = error;
	});
	
	$scope.save_attempt = function(){
		$scope.loading = true;
		ExamsAnalysisService.save_answers($scope.attempt)
		.then(function(response){
			$scope.loading = false;
			// TODO, check for differences
			//$scope.attempt = response.data;
			//$scope.set_answers($scope.attempt);
		}, function(error){
			$scope.loading = false;
			$scope.error = error;
		});
	};

	$scope.time_out = function(){
		confirm("Time is up! On the actual test you would have to stop now.");
	}
	
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
		clearInterval(timer);
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
		if($scope.indx <= 0){
			return;
		}	
		$scope.indx -= 1;
	};
		
	//navigate to previous question
	$scope.nextQuestion = function() {
		if($scope.indx >= $scope.attempt.questions.length - 1){
			return;
		}	
		$scope.indx += 1;
	};

	$scope.checkNextQuestion = function() {
		if($scope.indx >= $scope.attempt.questions.length - 1){
			return true;
		}
		else
			return false;
	}

	$scope.checkPrevQuestion = function() {
		if($scope.indx <= 0){
			return true;
		}
		else
			return false;
	}

	$scope.change_question = function(newIndex) {
		$scope.indx = newIndex;
	};

	$scope.open_calculator = function(){
		$scope.calc_opened = true;
		var modalInstance = $uibModal.open({
			windowClass: 'calc-modal',
			animation: false,
			templateUrl: '/modules/exams-take/client/views/calc-modal.client.view.html',
			backdrop: 'static',
			keyboard: false,
			controller: 'calculatorModal',
			backdropClass: 'calc-modal',
			openedClass: 'calc-open',
		});	
		modalInstance.result.then(null,
		function() {
			$scope.calc_opened = false;
		});
	};

	$scope.open_notepad = function(){
		$scope.notepad_opened = true;
		var modalInstance = $uibModal.open({
			windowClass: 'notepad-modal',
			animation: false,
			templateUrl: '/modules/exams-take/client/views/notes-modal.client.view.html',
			backdrop: 'static',
			keyboard: false,
			controller: 'notepadModal',
			backdropClass: 'calc-modal',
			resolve: {
				attempt: function(){
					return $scope.attempt;
				}
			}
		});	
		modalInstance.result.then(null, 
		function() {
			$scope.notepad_opened = false;
		});
	};
	$scope.open_formula_sheet = function(){
		$scope.formula_opened = true;
		var modalInstance = $uibModal.open({
			windowClass: 'formula-modal',
			animation: false,
			size: 'lg',
			templateUrl: '/modules/exams-take/client/views/formula-modal.client.view.html',
			backdrop: 'static',
     		keyboard: false,
    		controller: 'formulaModal',
			backdropClass: 'calc-modal',
			resolve: {
				exam_class: function(){
					return $scope.attempt.exam_class;
				}
			}
		});		
		modalInstance.result.then(null,
		function(){
			$scope.formula_opened = false;
		});
	};
	

}
  
})();

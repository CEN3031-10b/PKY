(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddQuestionController', AddQuestionController);

  AddQuestionController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance', 'selected_exam','old_question'];

  function AddQuestionController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, selected_exam, old_question) {
    
	// init
	$scope.selected_exam = selected_exam;
	$scope.selected_type = null;
	$scope.old_question = null;
	$scope.alert = {};
	$scope.loading = false;	
	$scope.multiple_choice = 'multiple choice';
	$scope.multiple_select = 'multiple select';
	$scope.fill_in_the_blank = 'fill in the blank';

	// separate variables to save info if a question type is switched
	$scope.mc_question = {};
	$scope.mc_question.answers = [];
	$scope.mc_question.exam = selected_exam._id;
	$scope.mc_question.type = $scope.multiple_choice;
	
	$scope.ms_question = {};
	$scope.ms_question.answers = [];
	$scope.ms_question.exam = selected_exam._id;
	$scope.ms_question.type = $scope.multiple_select;
	
	$scope.fitb_question = {};
	$scope.fitb_question.answers = [];
	$scope.fitb_question.exam = selected_exam._id;
	$scope.fitb_question.type = $scope.fill_in_the_blank;
	
	// edit mode if old_question is not null
	if(old_question){
		// copy to prevent question from changing beneath modal
		$scope.selected_type = old_question.type;
		$scope.old_question = old_question;
		$scope.question = JSON.parse(JSON.stringify(old_question));
	}
	
	$scope.set_type = function(_type){
		$scope.selected_type = _type;
		if(_type === $scope.multiple_choice){
			$scope.question = $scope.mc_question;
		}
		else if(_type === $scope.multiple_select){
			$scope.question = $scope.ms_question;
		}
		else if(_type === $scope.fill_in_the_blank){
			$scope.question = $scope.fitb_question;
		}
	};
  
    $scope.add_new_answer = function(_question){
		if(_question.answers != null)
		_question.answers.push({
			content: '',
			correct: false,
			is_numeric: false,
			tolerance: 0,
			value: 0
		});
    };
	
	$scope.select_mc_answer = function(index){
		// sets selected index to correct, all others false
		if($scope.mc_question && $scope.mc_question.answers){
			for(var i = 0; i < $scope.mc_question.answers.length; ++i){
				$scope.mc_question.answers[i].correct = (i==index);
			}
		}
	};
	  
    $scope.remove_answer = function(_question,_index){
		if(_question.answers)
		_question.answers.splice(_index, 1);  
    };
	
    $scope.submit = function(){
		$scope.loading = true;
		
		// if edit mode, update question
		if(old_question){
			ExamsService.update_question($scope.question)
			.then(function(response){
				$scope.loading = false;
				old_question = response.data;
				selected_exam.version++;
				$scope.ok();
			}, function(error){
				$scope.loading = false;
				if(error.data && error.data.message)
				$scope.set_alert(error.data.message);
			console.log($scope.question);
			console.log(error);
			});
			
			return;
		}
		
		// add question, associate with test  
		ExamsService.create_question($scope.question)
		.then(function(response){
			selected_exam.questions.push(response.data);
			selected_exam.version++;
			$scope.ok();
		}, function(error){
			$scope.loading = false;
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

	// prevent browser navigation underneath modal
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddQuestionController', AddQuestionController);

  AddQuestionController.$inject = ['$timeout','$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance', '$document', 'selected_exam','old_question'];

  function AddQuestionController($timeout, $scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, $document, selected_exam, old_question) {
    
	
	// load mathquill after page loads
	$scope.ans_id = 0;
	var MQ = MathQuill.getInterface(2);
	$scope.$watch('$viewContentLoaded', function(){
		
		if(!$scope.question)
			return;
		
		var mqt = MQ.StaticMath($document.find('#mq-test')[0]);
		var mq_content = MQ.MathField($document.find('#mq-content')[0], {
			handlers: {
				edit: function(mq) {
					$scope.question.content = mq.latex();
					$scope.$apply();
				}
			}
		});
		
		if(mq_content){
			mq_content.select();
			mq_content.clearSelection();
			mq_content.write($scope.question.content);
		}
		
	});
	
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
		for(var i = 0; i <$scope.question.answers.length; ++i){
			$scope.question.answers[i].id = $scope.ans_id;
			$scope.question.answers[i].id2 = $scope.ans_id + 1;
			$scope.ans_id +=2;
			console.log($scope.question.answers[i])
		}
		//$scope.$apply();
		
		$timeout(function(){ 
			$scope.set_mathquill_fields();			
		},0);
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
		
		$scope.init = true;
		
		$timeout(function(){ 
			$scope.set_mathquill_fields();			
		},0);
	};
  
	
    $scope.add_new_answer = function(_question){
		
		var answer = {
			content: '',
			correct: false,
			is_numeric: false,
			tolerance: 0,
			value: 0,
			id: $scope.ans_id,
			id2:($scope.ans_id+1)
		};
		
		$scope.ans_id += 2;
		
		if(_question.answers != null)
		_question.answers.push(answer);
		
		$timeout(function(){ 
			$scope.set_mathquill_fields();			
		},0);

    };
	
	$scope.init = true;
	$scope.set_mathquill_fields = function(){
		
		for(var i = 0; i < $scope.question.answers.length; ++i){
			//if($scope.question.type !== $scope.fill_in_the_blank)
			{
				var f1 = function(mq, i){
					for(var j = 0; j < $scope.question.answers.length; ++j){
						if($scope.question.answers[j].id === mq){
							$scope.question.answers[j].content = i.latex();
							$scope.$apply();
							break;
						}
					}
				};
				
				f1 = f1.bind(null, $scope.question.answers[i].id);

				var mqa = MQ.MathField($('#mqid'+$scope.question.answers[i].id)[0], {
					handlers: {
						edit: f1
					}
				});
				
				if($scope.init && mqa){
					mqa.select();
					mqa.clearSelection();
					mqa.write($scope.question.answers[i].content);
				}
				
			
			}
			if($scope.question.type === $scope.fill_in_the_blank)
			{
				// separate bind for fill in the blank (uses label instead of content)
				var f2 = function(mq, i){
					for(var j = 0; j < $scope.question.answers.length; ++j){
						if($scope.question.answers[j].id2 === mq){
							$scope.question.answers[j].label = i.latex();
							$scope.$apply();
							break;
						}
					}
				};
				
				f2 = f2.bind(null, $scope.question.answers[i].id2);
				
				var mqa2 = MQ.MathField($('#mqid'+$scope.question.answers[i].id2)[0], {
					handlers: {
						edit: f2
					}
				});
				
				if($scope.init && mqa2){
					mqa2.select();
					mqa2.clearSelection();
					mqa2.write($scope.question.answers[i].label);	
				}
							
			}
		}
		$scope.init = false;

	};
	
	$scope.select_mc_answer = function(index){
		if($scope.question.type !== $scope.multiple_choice)
			return;
		
		// sets selected index to correct, all others false
		if($scope.question && $scope.question.answers){
			for(var i = 0; i < $scope.question.answers.length; ++i){
				$scope.question.answers[i].correct = (i==index);
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
				old_question.content = response.data.content;
				old_question.points = response.data.points;
				old_question.standard = response.data.standard;
				old_question.answers = response.data.answers;
				selected_exam.version++;
				$scope.ok();
			}, function(error){
				$scope.loading = false;
				if(error.data && error.data.message)
				$scope.set_alert(error.data.message);
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

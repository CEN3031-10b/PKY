(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddQuestionController', AddQuestionController);

  AddQuestionController.$inject = ['$window','$timeout','$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance', '$document', 'selected_exam','old_question','standards', 'FileUploader'];

  function AddQuestionController($window, $timeout, $scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, $document, selected_exam, old_question, standards, FileUploader) {
    
	// init
	$scope.standards = standards.data;
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
	$scope.mc_question.standards = [];
	$scope.mc_question.answers = [];
	$scope.mc_question.exam = selected_exam._id;
	$scope.mc_question.type = $scope.multiple_choice;
	
	$scope.ms_question = {};
	$scope.ms_question.standards = [];
	$scope.ms_question.answers = [];
	$scope.ms_question.exam = selected_exam._id;
	$scope.ms_question.type = $scope.multiple_select;
	
	$scope.fitb_question = {};
	$scope.fitb_question.standards = [];
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
		
		$scope.init = true;
	};
  
	
    $scope.add_new_answer = function(_question){
		
		var answer = {
			content: '',
			correct: false,
			is_numeric: false,
			tolerance: 0,
			value: 0,
		};
		
		if(_question.answers != null)
		_question.answers.push(answer);
		
    };
	
	$scope.add_new_standard = function(_question){
		var standard = "";
		if(_question.standards != null)
		_question.standards.push(standard);
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

    $scope.remove_standard = function(_question,_index){
    	if(_question.standards)
    	_question.standards.splice(_index, 1);
    }
	
    $scope.submit = function(){
		$scope.loading = true;
		console.log($scope.question.standards);
		// if edit mode, update question
		if(old_question){
			ExamsService.update_question($scope.question)
			.then(function(response){
				$scope.loading = false;
				old_question.content = response.data.content;
				old_question.points = response.data.points;
				old_question.standards = response.data.standards;
				old_question.answers = response.data.answers;
				old_question.imageURL = response.data.imageURL;
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
	
	// ----- image upload -----
	$scope.imageURL = null;
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture',
      onAfterAddingFile: onAfterAddingFile,
      onSuccessItem: onSuccessItem,
      onErrorItem: onErrorItem
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    function onAfterAddingFile(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
			$scope.image_upload_success = '';
          }, 0);
        };
      }
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(fileItem, response, status, headers) {
		$scope.image_upload_success = 'image uploaded successfully';
		$scope.question.imageURL = response.profileImageURL;
		// Clear upload buttons
		cancelUpload();
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(fileItem, response, status, headers) {
	$scope.image_upload_success = 'error uploading image';
      // Clear upload buttons
      cancelUpload();
    }

    // Change user profile picture
    $scope.uploadProfilePicture = function() {
      // Start upload
      $scope.uploader.uploadAll();
    }

    // Cancel the upload process
    function cancelUpload() {
		$scope.imageURL = null;
		$scope.uploader.clearQueue();
    }
	
	$scope.cancelUpload = cancelUpload;
	
	$scope.delete_image = function(){
		$scope.question.imageURL = null;
	}
	
  }
  
})();

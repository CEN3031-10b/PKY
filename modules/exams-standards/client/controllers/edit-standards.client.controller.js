(function () {
  'use strict';

  angular
    .module('standards')
    .controller('EditStandardsController', EditStandardsController);

  EditStandardsController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','standards'];

  function EditStandardsController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, standards) {
	$scope.standards = standards.data;
	$scope.loading = false;
	
	$scope.edit_standard = function(_standard){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-standards/client/views/add-standard.client.view.html',
        controller: 'AddStandardController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_standard: function(){
			return _standard;
		  }
        }
        });
	  
		modalInstance.result.then(
		function (edited_standard) {
		  if(edited_standard){
			  for(var i = 0; i < $scope.standards.length; ++i){
				  if($scope.standards[i]._id === edited_standard._id){
					  $scope.standards[i] = edited_standard;
					  return;
				  }
			  }
			  
			  $scope.standards.push(edited_standard);
		  }
		});
	};
	
	$scope.delete_standard = function(_standard){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '/modules/exams-crud/client/views/prompt-yes-no.client.view.html',
			controller: 'PromptController',
			windowClass: 'prompt-modal',
			size: 'lg',
			resolve: {
				string_header: function(){
					return 'Are you sure you want to permanantely delete this standard?';
				}
			}
		});

	  modalInstance.result.then(
	  function (yes) {
		  if(yes){
			$scope.loading = true;
			ExamsService.delete_standard(_standard._id)
			.then(function(response){
				$scope.loading = false;
				$scope.standards.splice($scope.standards.indexOf(_standard), 1);
			}, function(error){
				$scope.loading = false;
			});
		  }
	  });
	};
  }
  
})();

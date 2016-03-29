(function () {
  'use strict';

  angular
    .module('standards')
    .controller('AddStandardController', AddStandardController);

  AddStandardController.$inject = ['$timeout','$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance', '$document', 'old_standard'];

  function AddStandardController($timeout, $scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, $document, old_standard) {
    
	$scope.standard = {};
	$scope.alert = {};
	if(old_standard){
		$scope.old_standard = old_standard;
		$scope.standard = JSON.parse(JSON.stringify(old_standard));
	}

    $scope.submit = function(){
		$scope.loading = true;
		
		if(old_standard){
			ExamsService.update_standard($scope.standard)
			.then(function(response){
				$scope.loading = false;
				old_standard.content = response.data.content;
				old_standard.code = response.data.code;
				old_standard.notes = response.data.notes;
				$scope.ok(old_standard);
			}, function(error){
				$scope.loading = false;
				if(error.data && error.data.message)
				$scope.set_alert(error.data.message);
				console.log(error);
			});
			
			return;
		}
		
		ExamsService.create_standard($scope.standard)
		.then(function(response){
			$scope.ok(response.data);
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
	
	$scope.ok = function (data) {
      $uibModalInstance.close(data);
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

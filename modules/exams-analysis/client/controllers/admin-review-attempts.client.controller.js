(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .controller('AdminAttemptController', AdminAttemptController);

  AdminAttemptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$uibModal','ExamsAnalysisService', 'AllAttempts'];

  function AdminAttemptController($scope, $rootScope, $state, $stateParams, Authentication, $uibModal,ExamsAnalysisService, AllAttempts) {
		$scope.all_attempts = AllAttempts.data;
		
		$scope.delete_attempt = function(_attempt){
			ExamsAnalysisService.delete_attempt(_attempt._id)
			.then(function(response){
				$scope.all_attempts.splice($scope.all_attempts.indexOf(_attempt),1);
			}, function(error){
				$scope.error = error;
				console.log(error);
			});
		};
  }
  
})();

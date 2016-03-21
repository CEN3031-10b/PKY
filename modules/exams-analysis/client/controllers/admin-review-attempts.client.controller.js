(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .controller('AdminAttemptController', AdminAttemptController);

  AdminAttemptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$uibModal', 'AllAttempts'];

  function AdminAttemptController($scope, $rootScope, $state, $stateParams, Authentication, $uibModal, AllAttempts) {
		$scope.all_attempts = AllAttempts.data;

	
  }
  
})();

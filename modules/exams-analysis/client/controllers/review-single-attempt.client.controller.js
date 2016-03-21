(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .controller('ReviewAttemptController', ReviewAttemptController);

  ReviewAttemptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$uibModal', 'Attempt'];

  function ReviewAttemptController($scope, $rootScope, $state, $stateParams, Authentication, $uibModal, Attempt) {
		$scope.attempt = Attempt.data;

	
  }
  
})();

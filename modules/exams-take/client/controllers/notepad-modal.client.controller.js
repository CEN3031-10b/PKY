(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('notepadModal', notepadModal);

  notepadModal.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal', '$uibModalInstance','attempt'];

  function notepadModal($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal, $uibModalInstance, attempt) {
	
	$scope.attempt = attempt;
	
	$scope.exitCalc = function () {
      $uibModalInstance.dismiss('exitCalc');
    };
	// prevent browser navigation underneath modal
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
}
  
})();

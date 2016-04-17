(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('calculatorModal', calculatorModal);

  calculatorModal.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal', '$uibModalInstance'];

  function calculatorModal($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal, $uibModalInstance) {
	
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

(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('formulaModal', formulaModal);

  formulaModal.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal', '$uibModalInstance'];

  function formulaModal($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal, $uibModalInstance) {
	
	$scope.exitFormula = function () {
      $uibModalInstance.dismiss('exitFormula');
    };

}
  
})();
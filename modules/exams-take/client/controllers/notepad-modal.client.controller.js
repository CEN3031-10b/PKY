(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('notepadModal', notepadModal);

  notepadModal.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal', '$uibModalInstance'];

  function notepadModal($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal, $uibModalInstance) {
	
	$scope.exitCalc = function () {
      $uibModalInstance.dismiss('exitCalc');
    };

}
  
})();

(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('CalcModalController', CalcModalController);

  CalcModalController.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModalInstance'];

  function CalcModalController($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModalInstance) {
	

  }
  
})();

(function () {
  'use strict';

  angular
    .module('standards')
    .controller('ViewStandardsController', ViewStandardsController);

  ViewStandardsController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','standards'];

  function ViewStandardsController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, standards) {
	$scope.standards = standards.data;
	$scope.loading = false;
	
	$scope.view_standard = function(_standard){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-standards/client/views/add-standard.client.view.html',
        controller: 'AddStandardController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_standard: function(){
			return _standard;
		  },
		  view:true
        }
        });
	};
  }
  
})();

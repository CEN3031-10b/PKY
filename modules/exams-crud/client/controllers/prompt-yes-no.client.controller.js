(function () {
  'use strict';

  angular
    .module('exams')
    .controller('PromptController', PromptController);

  PromptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance','old_exam', 'string_header', 'question'];

  function PromptController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, old_exam, string_header, question) {
    $scope.string_header = string_header;

	$scope.yes = function(){
		$uibModalInstance.close(true);
    };
  
    $scope.no = function () {
		$uibModalInstance.close();
    };

    $scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
    };
 
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
  
  }
  
})();

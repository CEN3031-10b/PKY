(function () {
  'use strict';

  angular
    .module('exams')
    .controller('PromptController', PromptController);

  PromptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance','old_exam', 'string_header', 'question'];

  function PromptController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, old_exam, string_header, question) {
    $scope.string_header = string_header;
    $scope.yes = function(){
      if(old_exam != null){
        ExamsService.delete_exam(old_exam._id)
        .then(function(response){
          $scope.ok();
        }, function(error){
          //TODO
        });
      window.location.href = '../exams/edit/';
      }
      else{
        ExamsService.delete_question(question._id)
        .then(function(response){
          $scope.ok();
        }, function(error){
          //TODO
        });
        location.reload();     
      }
      $uibModalInstance.close();

    };
  
    $scope.no = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    window.onpopstate = function(event) {
      $uibModalInstance.close();
    };
  
  $scope.$on('$locationChangeStart', function(event) {
    event.preventDefault();
    $uibModalInstance.dismiss('cancel');
  });
  
  }
  
})();

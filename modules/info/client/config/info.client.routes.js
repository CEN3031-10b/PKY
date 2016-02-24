(function () {
  'use strict';

  angular
    .module('info.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('info', {
		  url: '/information',
      template: '<ui-view></ui-view>',
      abstract:true
      })
      .state('info.1', {
		
    url:'/1',
		
    parent: 'info',
        templateUrl: 'modules/info/client/views/info1.client.view.html'
      });
  }

})();

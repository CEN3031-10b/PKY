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
      abstract:true,
      })

      .state('info.1', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info1.client.view.html'
      })

      .state('info.2', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info2.client.view.html'
      })

      .state('info.3', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info3.client.view.html'
      })

      .state('info.4', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info4.client.view.html'
      })

      .state('info.5', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info5.client.view.html'
      });
  }

})();

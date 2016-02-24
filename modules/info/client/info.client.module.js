(function (app) {
  'use strict';
  
  app.registerModule('info',['angular.filter']);
  app.registerModule('info.services');
  app.registerModule('info.routes', ['ui.router', 'info.services']);
})(ApplicationConfiguration);

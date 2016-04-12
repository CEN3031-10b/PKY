(function (app) {
  'use strict';
  
  app.registerModule('standards',['angular.filter','exams.services','trNgGrid']);
  app.registerModule('standards.services');
  app.registerModule('standards.routes', ['ui.router', 'exams.services','standards.services']);
})(ApplicationConfiguration);

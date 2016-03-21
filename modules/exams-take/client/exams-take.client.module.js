(function (app) {
  'use strict';
  
  app.registerModule('exams-take',['angular.filter']);
  app.registerModule('exams-take.services');
  app.registerModule('exams-take.routes', ['ui.router', 'exams-take.services']);
})(ApplicationConfiguration);

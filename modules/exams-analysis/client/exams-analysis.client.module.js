(function (app) {
  'use strict';
  app.registerModule('exams-analysis',['angular.filter']);
  app.registerModule('exams-analysis.services');
  app.registerModule('exams-analysis.routes', ['ui.router', 'exams-analysis.services']);
})(ApplicationConfiguration);

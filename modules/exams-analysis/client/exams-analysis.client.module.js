(function (app) {
  'use strict';
  app.registerModule('exams-analysis',['trNgGrid']);
  app.registerModule('exams-analysis.services');
  app.registerModule('exams-analysis.routes', ['ui.router', 'exams-analysis.services']);
})(ApplicationConfiguration);

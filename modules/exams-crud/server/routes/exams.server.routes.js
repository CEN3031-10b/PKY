'use strict';

/**
 * Module dependencies
 */
var examsPolicy = require('../policies/exams.server.policy'),
  exams = require('../controllers/exam.server.controller');

module.exports = function (app) {
  app.route('/api/exams').all(examsPolicy.isAllowed)
    .get(exams.listAll)
    .post(exams.create);
	
  app.route('/api/exams/class/:classId').all(examsPolicy.isAllowed)
    .get(exams.listByClassID);
	
  app.route('/api/exams/:examId/questions/:questionId').all(examsPolicy.isAllowed)
    .delete(exams.removeQuestion);

  // Single exam routes
  app.route('/api/exams/:examId').all(examsPolicy.isAllowed)
    .get(exams.read)
    .put(exams.update)
    .delete(exams.delete);

  // Finish by binding the exam middleware
  app.param('classId', exams.examsByClassID);
  app.param('examId', exams.examByID);
};

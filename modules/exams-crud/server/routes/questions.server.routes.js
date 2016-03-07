'use strict';

/**
 * Module dependencies
 */
var questionsPolicy = require('../policies/questions.server.policy'),
  questions = require('../controllers/question.server.controller');

module.exports = function (app) {
  app.route('/api/questions').all(questionsPolicy.isAllowed)
    .get(questions.list)
    .post(questions.create);
	
  // Single question routes
  app.route('/api/questions/:questionId').all(questionsPolicy.isAllowed)
    .get(questions.read)
    .put(questions.update)
    .delete(questions.delete);

  // Finish by binding the question middleware
  app.param('questionId', questions.questionByID);
};

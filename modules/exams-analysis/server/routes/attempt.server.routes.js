'use strict';

/**
 * Module dependencies
 */
var attemptPolicy = require('../policies/attempt.server.policy'),
  attempt = require('../controllers/attempt.server.controller');

module.exports = function (app) {
  app.route('/api/attempts').all(attemptPolicy.isAllowed)
    .get(attempt.getAllAttemptsByReqUser)
    .post([attempt.validateNewAttempt,attempt.create]);
	
  app.route('/api/attempts/:attemptId').all(attemptPolicy.isAllowed)
    .put(attempt.updateAnswers)
	.post(attempt.gradeAttempt)
	.delete(attempt.delete);
	
  app.route('/api/admin/attempts').all(attemptPolicy.isAllowed)
    .get(attempt.getAllAttempts);
	
  app.param('attemptId', attempt.attemptByID);
};

'use strict';

/**
 * Module dependencies
 */
var standardsPolicy = require('../policies/standards.server.policy'),
  standards = require('../controllers/standards.server.controller');

module.exports = function (app) {
  app.route('/api/standards').all(standardsPolicy.isAllowed)
    .get(standards.listAll)
    .post(standards.create);
	
  // Single exam routes
  app.route('/api/standards/:standardId').all(standardsPolicy.isAllowed)
    .get(standards.read)
    .put(standards.update)
    .delete(standards.delete);

  // Finish by binding the exam middleware
  app.param('standardId', standards.standardByID);
};

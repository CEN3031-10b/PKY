'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/exams',
      permissions: '*'
    }, {
      resources: '/api/exams/:examId',
      permissions: '*'
    }, {
      resources: '/api/exams/class/:classId',
      permissions: '*'
    }, {
      resources: '/api/exams/:examId/questions/:questionId',
      permissions: '*'
    }]
  },
  {
    roles: ['user'],
    allows: [{
      resources: '/api/exams',
      permissions: 'get'
    }, {
      resources: '/api/exams/:examId',
      permissions: []
    }, {
      resources: '/api/exams/class/:classId',
      permissions: []
    }, {
      resources: '/api/exams/:examId/questions/:questionId',
      permissions: []
    }]
  }]);
};


exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  req.admin = roles.indexOf('admin') >= 0;
  console.log(roles, req.route.path, req.method);

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

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
      resources: '/api/admin/attempts',
      permissions: '*'
    }, {
      resources: '/api/attempts',
      permissions: '*'
    }, {
      resources: '/api/attempts/:attemptId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/attempts',
      permissions: ['get','post','put']
    }, {
      resources: '/api/attempts/:attemptId',
      permissions: ['get','post','put']
    }]
  }, {
    roles: ['guest'],
    allows: []
  }]);
};


exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];
  req.admin = roles.indexOf('admin') >= 0;

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

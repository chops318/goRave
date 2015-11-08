'use strict';

/**
 * Module dependencies.
 */
var ravesPolicy = require('../policies/raves.server.policy.js'),
  raves = require('../controllers/raves.server.controller');

module.exports = function (app) {
  // Raves collection routes
  app.route('/api/raves').all(ravesPolicy.isAllowed)
    .get(raves.list)
    .post(raves.create);

  // Single rave routes
  app.route('/api/raves/:raveId').all(ravesPolicy.isAllowed)
    .get(raves.read)
    .put(raves.update)
    .delete(raves.delete);

  // Finish by binding the rave middleware
  app.param('raveId', raves.raveByID);
};

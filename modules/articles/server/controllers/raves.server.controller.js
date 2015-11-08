'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rave = mongoose.model('Rave'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a rave
 */
exports.create = function (req, res) {
  var rave = new Rave(req.body);
  rave.user = req.user;

  rave.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rave);
    }
  });
};

/**
 * Show the current rave
 */
exports.read = function (req, res) {
  res.json(req.rave);
};

/**
 * Update a rave
 */
exports.update = function (req, res) {
  var rave = req.rave;

  rave.title = req.body.title;
  rave.content = req.body.content;

  rave.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rave);
    }
  });
};

/**
 * Delete an rave
 */
exports.delete = function (req, res) {
  var rave = req.rave;

  rave.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rave);
    }
  });
};

/**
 * List of Raves
 */
exports.list = function (req, res) {
  Rave.find().sort('-created').populate('user', 'displayName').exec(function (err, raves) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(raves);
    }
  });
};

/**
 * Rave middleware
 */
exports.raveByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rave is invalid'
    });
  }

  Rave.findById(id).populate('user', 'displayName').exec(function (err, rave) {
    if (err) {
      return next(err);
    } else if (!rave) {
      return res.status(404).send({
        message: 'No rave with that identifier has been found'
      });
    }
    req.rave = rave;
    next();
  });
};

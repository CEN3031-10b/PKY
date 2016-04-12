'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Standard = mongoose.model('Standard'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a standard
 */
exports.create = function (req, res) {
  var standard = new Standard(req.body);
  
  standard.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};

/**
 * Show the current standard
 */
exports.read = function (req, res) {
  res.json(req.standard);
};

/**
 * Update a standard
 */
exports.update = function (req, res) {
  var standard = req.standard;
  standard.code = req.body.code;
  standard.content = req.body.content;
  standard.notes = req.body.notes;

  
  standard.save(function (err) {
    if (err) {
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};

/**
 * Delete a standard
 */
exports.delete = function (req, res) {
  var standard = req.standard;
  standard.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(standard);
    }
  });
};



/**
 * List of standards
 */
exports.listAll = function (req, res) {
  Standard.find({})
  .sort({ 'code' : 'asc'})
  .exec(function (err, standards) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
	else {
		res.json(standards);
    }
  });
};

/**
 * standard middleware
 */
exports.standardByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invalid exam ID'
    });
  }

  Standard.findById(id)
  .exec(function (err, standard) {
    if (err) {
      return next(err);
    } else if (!standard) {
      return res.status(404).send({
        message: 'No standard with that identifier has been found'
      });
    }
	req.standard = standard;
    next();
  });
};


'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Question = mongoose.model('Question'),
  Exam = mongoose.model('Exam'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

process.on('uncaughtException', function(err){
  console.log('Caught exception: ' + err);
});

/**
 * Create a question
 */
exports.create = function (req, res) {
  var question = new Question(req.body);

  question.save(function (err,q) {
    if (err) {
	  console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if(req.body.exam) {
		// if create question req had an optional exam parameter, add to exam
      Exam.findOneAndUpdate({ _id:req.body.exam },
        {
          $push:{ 'questions': q._id }
        },
		function(err,exam){
  if (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
  res.json(question);
		});
    }
	else{
      res.json(question);
    }
  });
};

/**
 * Show the current question
 */
exports.read = function (req, res) {
  res.json(req.question);
};

/**
 * Update an question
 */
exports.update = function (req, res) {
  var question = req.question;
  question.content = req.body.content;
  question.answers = req.body.answers;
  question.type = req.body.type;

  question.save(function (err) {
    if (err) {
		console.log(JSON.stringify(err));
      return res.status(400).send({
        //message: err
		message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * Delete a question
 */
exports.delete = function (req, res) {
  var question = req.question;
  question.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * List of Questions
 */
exports.list = function (req, res) {
  Question.find().sort('-created').populate('questions').exec(function (err, questions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(questions);
    }
  });
};

/**
 * Question middleware
 */
exports.questionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invalid question ID'
    });
  }

  Question.findById(id).exec(function (err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }
    req.question = question;
    next();
  });
};

'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Question = mongoose.model('Question'),
  Exam = mongoose.model('Exam'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/*
 * Create a question
 */
exports.create = function (req, res) {
	var question = new Question(req.body);
	question.save(function (err,q) {
		if (err) {
			return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
			});
		} 
		// if create question req had an optional exam parameter, add question to exam
		else if(req.body.exam) {
			Exam.findOneAndUpdate({ _id:req.body.exam },{$push:{ 'questions': q._id },$inc:{'version':1}},
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

/*
 * Update a question
 */
exports.update = function (req, res) {
	
	// create a new question, preserving old one for attempt history
	// then disassociate with tests and add the updated question
	var question = {};
	var _id = req.question._id;
	question.content = req.body.content;
	question.answers = req.body.answers;
	question.type = req.body.type;
	question.standards = req.body.standards;
	question.points = req.body.points;
	question.imageURL = req.body.imageURL;
	console.log("HEREEEEEEEEEEEEEEEEE");
	console.log(question.imageURL);
	question = new Question(question);
	
	question.save(function (err, q) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		
		// find exams using the previous question
		Exam.find({'questions': _id},
		function(err, exams){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}

			// loop through exams with a reference to the old question, 
			// update it to the new id
			for(var i = 0; i < exams.length; ++i){
				// push and splice because changing the value wasn't working
				// TODO test fix: doc.markModified('property');
				exams[i].version++;
				exams[i].questions.push(q._id);
				exams[i].questions.splice(exams[i].questions.indexOf(_id),1);
				exams[i].save(function(error,exam){
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
				});	
			}
		})
		.exec(function(){
			return res.json(q);
		});
	});
};


/*
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

/*
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

/*
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

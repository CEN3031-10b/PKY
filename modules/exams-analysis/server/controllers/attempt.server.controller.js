'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),  
  Exam = mongoose.model('Exam'),
  Attempt = mongoose.model('Attempt'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


exports.create = function (req, res) {
  // req.attempt is the newly created attempt from validateNewAttempt
  var attempt = new Attempt(req.attempt);
  attempt.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
	else {
		// populate questions, remove answers 
		attempt.populate('questions', function(err, a){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			for(var i = 0; i < a.questions.length; ++i){
				for( var j = 0; j < a.questions[i].answers.length; ++j){
					delete a.questions[i].answers[j].value;
					delete a.questions[i].answers[j].tolerance;
					delete a.questions[i].answers[j].correct;
				}
			}
			res.json(a);
		});
    }
  });
};

// temp delete any attempt
exports.delete = function (req, res) {
	Attempt.findByIdAndRemove(req.params.attemptId, function(err, attempt){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(attempt);
		}
	});
};

exports.updateAnswers = function(req,res){
	// check if its past the allotted time
	var attempt = req.attempt;
	attempt.student_answers = req.body.student_answers;
	attempt.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			attempt.populate('questions', function(err, a){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				res.json(a);
			});
		}
	});
};

exports.getAllAttemptsByReqUser = function (req, res, next) {
	// can only get attempts of requesting user
	Attempt.find({'user':req.user._id})
	.sort('-created')
	.populate('exam')
	.populate('questions')
	.exec(function (err, attempts) {
		if (err) {
			return res.status(400).send({
				message: 'Invalid attempt ID'
			});
		} 
		else if (!attempts) {
			return res.status(404).send({
				message: 'No attempts found by user: ' + req.user._id
			});
		} 
		else{
			res.json(attempts);			
		}
	});
	
};

exports.getAllAttempts = function (req, res, next) {
	
	// can only get attempts of requesting user
	Attempt.find({})
	.sort('-created')
	.populate('exam')
	.populate('questions')
	.exec(function (err, attempts) {
		if (err) {
			return res.status(400).send({
				message: 'Invalid attempt ID'
			});
		} 
		else if (!attempts) {
			return res.status(404).send({
				message: 'No attempts found'
			});
		} 
		else{
			res.json(attempts);			
		}
	});
};

exports.attemptByID = function (req, res, next, id) {
	
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Invalid question ID'
		});
	}

	Attempt.findById(id)
	.populate('exam')
	.populate('questions.ref')
	.exec(function (err, attempt) {
		if (err) {
			return next(err);
		} 
		else if (!attempt) {
			return res.status(404).send({
				message: 'No attempt found.'
			});
		}
		req.attempt = attempt;
		next();
    });
};

exports.gradeAttempt = function(){
	
}

exports.validateNewAttempt = function(req,res,next){

	var attempt = {};
	attempt.exam = req.body.exam_id;
	attempt.user = req.user._id;
	
	Attempt.findOne({'user':attempt.user,'exam':attempt.exam,'submitted':false})
	.populate('questions')
	.exec(function(err, prevAttempt){
		
		if (err) {
			return res.status(400).send({
				message: 'db error fetching attempts'
			});
		}
		
		// if an attempt is already in progress for this exam
		if(prevAttempt){
				for(var i = 0; i < prevAttempt.questions.length; ++i){
					for( var j = 0; j < prevAttempt.questions[i].answers.length; ++j){
						delete prevAttempt.questions[i].answers[j].value;
						delete prevAttempt.questions[i].answers[j].tolerance;
						delete prevAttempt.questions[i].answers[j].correct;
					}
				}			
				return res.json(prevAttempt);					
		}
		else{
			// new attempt
			Exam.findById(attempt.exam)
			.populate('questions')
			.exec(function (error, exam) {
				if (error) {
					return res.status(400).send({
						message: 'db error finding exam for attempt'
					});
				} 
				else if (!exam) {
					return res.status(400).send({
						message: 'no exam with that id found'
					});
				}
				else{
					// no questions on the exam
					if(!exam.questions || exam.questions.length === 0){
						return res.status(400).send({
							message: 'no questions on exam'
						});
					}

					// exam and questions checked, set all the values of the attempt
					attempt.questions = [];
					for(var i=0; i < exam.questions.length; ++i){
						attempt.questions.push(exam.questions[i]._id);
					}
					
					attempt.start_time = Date.now();
					attempt.exam_title = exam.title;
					attempt.exam_class = exam.class;
					attempt.exam_version = exam.version;
					// TODO TEMP
					attempt.exam_allotted_time  = exam.allotted_time || 60;
					attempt.exam = exam._id;
					
					req.attempt = attempt;
					next();
				}
			});				
		}
	});
	

};

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
  var attempt = new Attempt(req.attempt);
  attempt.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
	else {
		// populate questions, remove answers 
		attempt.populate('questions.data', function(err, a){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			for(var i = 0; i < a.questions.length; ++i){
				for(var j = 0; j < a.questions[i].data.answers.length; ++j){
					a.questions[i].data.answers[j].value = null;
					a.questions[i].data.answers[j].tolerance = null;
					a.questions[i].data.answers[j].correct = null;
					if(a.questions[i].data.type === 'fill in the blank'){
						a.questions[i].data.answers[j].content = null;
					}
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

exports.updateAnswers = function(req, res){
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
			attempt.populate('questions.data', function(err, a){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				for(var i = 0; i < a.questions.length; ++i){
					for(var j = 0; j < a.questions[i].data.answers.length; ++j){
						a.questions[i].data.answers[j].value = null;
						a.questions[i].data.answers[j].tolerance = null;
						a.questions[i].data.answers[j].correct = null;
						if(a.questions[i].data.type === 'fill in the blank'){
							a.questions[i].data.answers[j].content = null;
						}
					}					
				}
				res.json(a);
			});
		}
	});
};
exports.getSingleAttemptByReqUser = function (req, res, next) {
		if(!req.user._id.equals(req.attempt.user)){
			return res.status(400).send({
				message: 'Unauthorized attempt request'
			});
		}
		else{
			res.json(req.attempt);
		}
};

exports.getAllAttemptsByReqUser = function (req, res, next) {
	Attempt.find({'user':req.user._id})
	.sort('-created')
	.populate('exam')
	.populate('questions.data')
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
	Attempt.find({})
	.sort('-created')
	.populate('exam')
	.populate('questions.data')
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
	.populate('questions.data')
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

exports.gradeAttempt = function(req,res,next){
	var attempt = req.attempt;
	attempt.submitted = true;
	for(var i = 0; i < attempt.questions.length; ++i){
		attempt.questions[i].points_earned = 0;
		var points_per_answer = Number(attempt.questions[i].data.points / attempt.questions[i].data.answers.length);
		if(attempt.questions[i].data.type === 'multiple choice'){
			for(var j = 0; j < attempt.questions[i].data.answers.length; ++j){
				// find the correct answer for the multiple choice question
				if(attempt.questions[i].data.answers[j].correct){
					// search for this answer in the student answers
					for(var k = 0; k < attempt.student_answers.length; ++k){
						if(attempt.questions[i].data._id.equals(attempt.student_answers[k].question_id)   
						&& attempt.questions[i].data.answers[j]._id.equals(attempt.student_answers[k].answer_id)
						&& attempt.student_answers[k].correct){
							attempt.questions[i].points_earned = attempt.questions[i].data.points;
						}
					}
				}
			}
		}
		else if(attempt.questions[i].data.type === 'multiple select'){
			for(var j = 0; j < attempt.questions[i].data.answers.length; ++j){
				var found = false;
				for(var k = 0; k < attempt.student_answers.length; ++k){	
					if(attempt.questions[i].data._id.equals(attempt.student_answers[k].question_id)   
					&& attempt.questions[i].data.answers[j]._id.equals(attempt.student_answers[k].answer_id)
					&& attempt.student_answers[k].correct === attempt.questions[i].data.answers[j].correct){
						attempt.questions[i].points_earned += points_per_answer;
						found = true;
					}
				}
				// add points for correctly omitted answers 
				// (student answers store correct choices only for multiple select)
				if(!found && attempt.questions[i].data.answers[j].correct === false){
					attempt.questions[i].points_earned += points_per_answer;
				}
			}
			attempt.questions[i].points_earned = Math.ceil(attempt.questions[i].points_earned * 100)/100;
		}
		else if(attempt.questions[i].data.type === 'fill in the blank'){
			for(var j = 0; j < attempt.questions[i].data.answers.length; ++j){
				for(var k = 0; k < attempt.student_answers.length; ++k){
					if(attempt.questions[i].data._id.equals(attempt.student_answers[k].question_id)   
					&& attempt.questions[i].data.answers[j]._id.equals(attempt.student_answers[k].answer_id)){
						if(attempt.questions[i].data.answers[j].is_numeric){
							if(Math.abs(attempt.questions[i].data.answers[j].value - attempt.student_answers[k].value) 
							<= attempt.questions[i].data.answers[j].tolerance){
								attempt.questions[i].points_earned += points_per_answer;
							}
						}
						else{
							// must be exact. temp solution until mathquill
							if(attempt.questions[i].data.answers[j].content === attempt.student_answers[k].content){
								attempt.questions[i].points_earned += points_per_answer;
							}
						}
					}
				}
			}		
		}
	}

	attempt.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} 
		else {
			attempt.populate('questions.data', function(err, a){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				res.json(a);
			});
		}
	});
}

exports.validateNewAttempt = function(req,res,next){

	var attempt = {};
	attempt.exam = req.body.exam_id;
	attempt.user = req.user._id;
	
	Attempt.find({'user':attempt.user, 'exam':attempt.exam})
	.populate('questions.data')
	.exec(function(err, prevAttempts){
		
		if (err) {
			return res.status(400).send({
				message: 'db error fetching attempts'
			});
		}
		
		// go through previous attempts for this exam
		if(prevAttempts.length > 0){
			for(var h = 0; h < prevAttempts.length; ++h){
				// if an attempt is in progress, send it back as response
				if(!prevAttempts[h].submitted){
					for(var i = 0; i < prevAttempts[h].questions.length; ++i){
						for( var j = 0; j < prevAttempts[h].questions[i].data.answers.length; ++j){
							prevAttempts[h].questions[i].data.answers[j].value = null;
							prevAttempts[h].questions[i].data.answers[j].tolerance = null;
							prevAttempts[h].questions[i].data.answers[j].correct = null;
							if(prevAttempts[h].questions[i].data.type === 'fill in the blank'){
								prevAttempts[h].questions[i].data.answers[j].content = null;
							}
						}							
					}
					
					return res.json(prevAttempts[h]);						
				}		
			}	
		}
	
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
				// check number of allowed attempts
				if(prevAttempts.length >= exam.allowed_attempts ){
					return res.status(400).send({
						message: 'No more remaining attempts for: ' + exam.title
					});
				}				
				
				// no questions on the exam
				if(!exam.questions || exam.questions.length === 0){
					return res.status(400).send({
						message: 'no questions on exam: ' + exam.title
					});
				}

				// exam and questions checked, set all the values of the attempt
				attempt.questions = [];
				for(var i = 0; i < exam.questions.length; ++i){
					attempt.questions.push({'data':exam.questions[i]._id});
				}
				
				attempt.start_time = Date.now();
				attempt.exam_title = exam.title;
				attempt.exam_class = exam.class;
				attempt.exam_version = exam.version;
				attempt.attempt_number = prevAttempts.length;
				attempt.exam_allotted_time  = exam.allotted_time;
				attempt.exam = exam._id;
				attempt.student_answers = [];
				
				req.attempt = attempt;
				next();
			}
		});				
		
	});
	
};

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QuestionTypes = ['multiple choice', 'multiple select', 'fill in the blank'];

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	/* 
	TODO: tests standards fields 
	*/
	type: {
		type: String, 
		/*enum: QuestionTypes,*/
		required: 'Question type cannot be blank'
	},
	content: {
		type: String,
		required: true
	},
	points:{
		type: Number,
		required: true  
	},
	answers: [{
		content:{
			type: String,
			required: true,  
			unique: true
		},
		value: {
			type: Number,
			default: -1,
		},
		tolerance:{
			type: Number,
			default: 0
		},
		correct:{
			type: Boolean,
			default: false,
		}
	}]
});

QuestionSchema.pre("save", function(next){
	var self = this;
	
	// test number of answers
	if(!self.answers.length){
		var err = new Error();
		err.errors = [];
		err.errors[0] = { message: "Invalid number of answers."};
		next(err);
	}
	
	// test number of multiple choice correct answers
	if(self.type === 'multiple choice'){
		var num_correct = 0;
		for(var i = 0; i < self.answers.length; ++i ){
			if(self.answers[i].correct){
				num_correct++;
			}
		}
		if(num_correct != 1){
			// add fields so that the error handler will find the message
			var err = new Error();
			err.errors = [];
			err.errors[0] = { message: "Invalid number of correct answers for multiple choice type question."};
			next(err);
		}
		else{
			next();
		}
	}
	else{
		next();
	}
});
	
mongoose.model('Question', QuestionSchema);

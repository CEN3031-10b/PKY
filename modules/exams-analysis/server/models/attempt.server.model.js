'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
/**
 * Attempt Schema
 */
var AttemptSchema = new Schema({
	/* 
	duplicate exam properties in case they are edited later 
	*/
	exam_title: {
		type: String,
		required:true
	},
	exam_version: {
		type: String,	
		required:true
	},
	exam_class:{
		type: String,
		required:true
	},
	exam_allotted_time:{
		type: Number,
		required:true
	},
	start_time: {
		type: Date,
		default: Date.now,
		required:true
	},
	submitted:{
		type: Boolean,
		default: false,
		required:true
	},
	attempt_number:{
		type: Number,
		required: true
	},
	user:{
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required:true
	},
	exam:{
		type: Schema.Types.ObjectId, 
		ref: 'Exam',
		required:true
	},
	questions: [{
		data:{
			type: Schema.Types.ObjectId, 
			ref: 'Question', 
			required:true			
		},
		points_earned:{
			type: Number,
			default: 0,
			required:true
		},
		mark_for_review:{
			type: Boolean,
			default: false,
			required: true
		}
	
	}],
	notes: {
		type: String
	}, 
	// student answers separate from questions for updating convenience
	student_answers: [{
		question_id:{
			type: Schema.Types.ObjectId,
			required:true
		},
		answer_id:{
			type: Schema.Types.ObjectId,
			required:true
		},
		label:{
			type: String,
		},
		content:{
			type: String,
		},
		is_numeric:{
			type: Boolean,
			required: true
		},
		value: {
			type: Number,
		},
		tolerance:{
			type: Number,
		},
		correct:{
			type: Boolean,
		}
	}]
});

AttemptSchema.pre("save", function(next){
	var self = this;
	var err = new Error();
	err.errors = [];
	
	if(self.isNew){
		self.start_time = Date.now();
		self.submitted = false;
	}
	
	next();
});

mongoose.model('Attempt', AttemptSchema);

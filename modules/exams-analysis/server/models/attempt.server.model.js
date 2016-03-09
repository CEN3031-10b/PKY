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
		default: 60,
		required:true
	},
	start_time: {
		type: Date,
		default: Date.now,
		required:true
	},
	submitted:{
		type: Boolean,
		default: false
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
			default: 0
		}
	}],
	
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
		value: {
			type: Number
		},
		correct:{
			type: Boolean,
			default:false,
		}
	}]
});


mongoose.model('Attempt', AttemptSchema);

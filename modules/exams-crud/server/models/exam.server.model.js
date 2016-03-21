'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
var ClassTypes = ['Algebra 1', 'Algebra 2'];

/**
 * Exam Schema
 */
var ExamSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
	required: true
  },
  modified: {
    type: Date,
    default: Date.now,
	required: true
  },
  title: {
    type: String,  
	required: true
  },
  version: {
	type: Number,
	default: 0,
	required: true
  },
  allotted_time:{
	type: Number,
	default: 0,
	required: true
  },
  allowed_attempts:{
	type: Number,
	default: 0,
	required: true,
  },
  published:{
	  type: Boolean,
	  default:false,
	  required:true
  },
  class: {
    type: String,
    enum: ClassTypes,
    required: 'Exam class cannot be blank'
  },
  questions: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Question' 
  }]
 
});

ExamSchema.pre("save", function(next){
	var self = this;
	var err = new Error();
	err.errors = [];
	
	if(self.isNew){
		self.created = Date.now();
	}
	else{
		self.modified = Date.now();
	}
	
	// enforce integer attributes
	self.allotted_time = Math.floor(self.allotted_time);
	if(self.allotted_time < 1){
		err.errors[0] = { message: "Allotted time must be greater than 1 minute."};
		next(err);
	}
	self.allowed_attempts = Math.floor(self.allowed_attempts);
	if(self.allowed_attempts < 1){
		err.errors[0] = { message: "Allowed attempts must be greater than 1."};
		next(err);
	}
	
	next();

});

mongoose.model('Exam', ExamSchema);

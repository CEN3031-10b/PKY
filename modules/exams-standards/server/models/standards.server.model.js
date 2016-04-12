'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
/**
 * Standard Schema
 */
var StandardSchema = new Schema({
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
  code: {
    type: String,  
	required: true,
	unique: true
  },
  content: {
    type: String,  
	required: true
  },
  notes:{
	type: String 
  }
});

StandardSchema.pre("save", function(next){
	var self = this;
	var err = new Error();
	err.errors = [];
	
	if(self.isNew){
		self.created = Date.now();
	}
	else{
		self.modified = Date.now();
	}
	
	next();
});

mongoose.model('Standard', StandardSchema);

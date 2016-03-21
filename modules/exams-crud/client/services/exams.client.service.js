(function () {
  'use strict';

  angular
    .module('exams.services')
    .factory('ExamsService', ['$http', function($http){
		
      var exam_url_base = '/api/exams';
      var question_url_base = '/api/questions';
		
		// exams
      return {
        get_exams : function(questions,answers){
          return $http.get(exam_url_base +'/?questions=' + (questions === 1) + '&answers=' + (answers === 1));
        },
        get_exam : function(id){
          return $http.get(exam_url_base + '/' + id);
        },	
			
        update_exam : function(exam){
          return $http.put(exam_url_base + '/' + exam._id, exam);
        },
			
        create_exam : function(exam){
          return $http.post(exam_url_base, exam);
        },
			
        delete_exam : function(id){
          return $http.delete(exam_url_base + '/' + id);
        },
		remove_question: function(exam, question_id){
		  return $http.delete(exam_url_base +'/'+exam._id+'/questions/' + question_id);
		},
			
			// questions
        get_questions : function(){
          return $http.get(question_url_base);
        },
			
        get_question : function(id){
          return $http.get(question_url_base + '/' + id);
        },	
			
        update_question : function(question){
          return $http.put(question_url_base + '/' + question._id, question);
        },
			
        create_question : function(question){
          return $http.post(question_url_base, question);
        },
			
        delete_question : function(id){
          return $http.delete(question_url_base + '/' + id);
        }
      };

    }]);
})();

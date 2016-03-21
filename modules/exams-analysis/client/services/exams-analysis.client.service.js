(function () {
  'use strict';

  angular
    .module('exams-analysis.services')
    .factory('ExamsAnalysisService', ['$http', function($http){
		
      return {
		    get_attempt : function(attempt_id){
				return $http.get('/api/attempts/' + attempt_id);
			},
			create_attempt :function(exam_id){
				return $http.post('/api/attempts', {'exam_id':exam_id});
			},
			delete_attempt: function(attempt_id){
				return $http.delete('/api/attempts/' + attempt_id);
			},
			get_attempts : function(){
				return $http.get('/api/attempts');
			},
			// admins only, users will get bad request returned
			get_all_attempts : function(){
				return $http.get('/api/admin/attempts');
			},
			save_answers: function(attempt){
				return $http.put('/api/attempts/' + attempt._id, attempt);
			},
			submit_attempt: function(attempt){
				return $http.post('/api/attempts/' + attempt._id);
			}
      };

    }]);
})();

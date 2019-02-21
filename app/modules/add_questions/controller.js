app.controller('add_questionsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
     $rootScope.hideButton = false;
    var urlQuestionbank = H.SETTINGS.baseUrl + '/question_banks';
    	$http.get(urlQuestionbank)
        	.then(function(r){
            	$scope.Questionbankdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
        	
     var urlQuestionSet = H.SETTINGS.baseUrl + '/question_sets';
    	$http.get(urlQuestionSet)
        	.then(function(r){
            	$scope.QuestionSetdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
});
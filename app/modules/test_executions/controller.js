/*global angular, app*/
app.controller('test_executionsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlUserStories = H.SETTINGS.baseUrl + '/user_stories';
    	$http.get(urlUserStories)
        	.then(function(r){
            	$scope.UserStoriesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestStatus = H.SETTINGS.baseUrl + '/test_status';
    	$http.get(urlTestStatus)
        	.then(function(r){
            	$scope.TestStatusdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestCases = H.SETTINGS.baseUrl + '/test_cases';
    	$http.get(urlTestCases)
        	.then(function(r){
            	$scope.TestCasesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
	
	var urlTestplan = H.SETTINGS.baseUrl + '/test_plans';
    	$http.get(urlTestplan)
        	.then(function(r){
            	$scope.Testplandata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
	
});
/*global angular, app*/
app.controller('test_casesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
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
    
       $scope.newcreationDate = function(Date){
       		$scope.data.single.creation_date = H.toMySQLDateTime(Date);
    	};
    	$scope.newexecutionDate = function(Date){
       		$scope.data.single.execution_date = H.toMySQLDateTime(Date);
    	};
});
/*global angular, app*/
app.controller('manage_batchesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    $rootScope.hideButton = false;
    var urlmanageCourses = H.SETTINGS.baseUrl + '/manage_courses';
    	$http.get(urlmanageCourses)
        	.then(function(r){
            	$scope.manageCoursesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlstatus = H.SETTINGS.baseUrl + '/status';
    	$http.get(urlstatus)
        	.then(function(r){
            	$scope.statusdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newstartDate = function(Date){
       		$scope.data.single.start_date = H.toMySQLDateTime(Date);
    	};
    $scope.newendDate = function(Date){
       		$scope.data.single.end_date = H.toMySQLDateTime(Date);
    	};
    	
});
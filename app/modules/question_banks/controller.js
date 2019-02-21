/*global angular, app*/
app.controller('question_banksControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlManageCourse = H.SETTINGS.baseUrl + '/manage_courses';
    	$http.get(urlManageCourse)
        	.then(function(r){
            	$scope.ManageCoursedata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
});
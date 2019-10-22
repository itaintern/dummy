/*global angular, app*/
app.controller('quizzesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
     $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    $rootScope.hideButton = false;
    var urlquestionSets = H.SETTINGS.baseUrl + '/question_sets';
    	$http.get(urlquestionSets)
        	.then(function(r){
            	$scope.questionSetsdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlusers = H.SETTINGS.baseUrl + '/users';
    	$http.get(urlusers)
        	.then(function(r){
            	$scope.usersdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newdate = function(Date){
       		$scope.data.single.date = H.toMySQLDateTime(Date);
    	};
    	
});
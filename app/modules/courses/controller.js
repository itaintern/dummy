
/*global angular, app*/
app.controller('coursesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M)
{
    
    $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    
    $rootScope.hideButton = false;
    var urllearningModules = H.SETTINGS.baseUrl + '/learning_modules';
    	$http.get(urllearningModules)
        	.then(function(r){
            	$scope.learningModulesdata = r.data;
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
        	
        	
    var urldurationTypes = H.SETTINGS.baseUrl + '/duration_types';
    	$http.get(urldurationTypes)
        	.then(function(r){
            	$scope.durationTypesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
});
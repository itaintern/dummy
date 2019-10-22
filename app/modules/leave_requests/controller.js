/*global angular, app*/
app.controller('leave_requestsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    $rootScope.hideButton = false;
    $scope.onLoadAll = function(obj){
    	$scope.setListHeaders(['From','To','cc Email','Message','Start Date','End Date','Type','Leave Status','Status','Reason','Is Paid']);
    };
    
   // var urlEmployee = H.SETTINGS.baseUrl + '/employees';
   // 	$http.get(urlEmployee)
   //     	.then(function(r){
   //         	$scope.EmployeeData = r.data;
   //     	},function(e){
   //     		if(e && e.data && e.data.error && e.data.error.status){
   //     			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
   //    		}
   //     	});
   
    var urlEmployee = H.SETTINGS.baseUrl + '/employees';
    	$http.get(urlEmployee)
        	.then(function(r){
            	$scope.EmployeeData = r.data;
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
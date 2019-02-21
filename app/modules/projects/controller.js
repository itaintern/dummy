/*global angular, app*/
app.controller('projectsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
    
    // var urlCompany = H.SETTINGS.baseUrl + '/companies';
    // 	$http.get(urlCompany)
    //     	.then(function(r){
    //         	$scope.companyname = r.data;
    //     	},function(e){
    //     		if(e && e.data && e.data.error && e.data.error.status){
    //     			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
    //     		}
    //     	});
    
     $rootScope.hideButton = false;
    var urlClient = H.SETTINGS.baseUrl + '/clients';
    	$http.get(urlClient)
        	.then(function(r){
            	$scope.Clientdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newestimatedStartDate = function(Date){
       		$scope.data.single.estimated_start_date = H.toMySQLDateTime(Date);
    	};
    	$scope.newestimatedEndDate = function(Date){
       		$scope.data.single.estimated_end_date = H.toMySQLDateTime(Date);
    	};
});
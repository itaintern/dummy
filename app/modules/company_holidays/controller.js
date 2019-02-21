/*global angular, app*/
app.controller('company_holidaysControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    $rootScope.hideButton = false;
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
    
    var url = H.SETTINGS.baseUrl + '/companies';
    	$http.get(url)
        	.then(function(r){
            	$scope.companyname = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newDate = function(Date){
       		$scope.data.single.holiday_date = H.toMySQLDateTime(Date);
    	};
    	
     // 	$scope.beforeLoadAll = function(query){
    	// 	query.is_deleted=0;
    	// 	return query;
    	// };
});
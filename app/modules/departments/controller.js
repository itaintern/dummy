/*global angular, app*/
app.controller('departmentsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    $rootScope.hideButton = false;
    var url = H.SETTINGS.baseUrl + '/companies';
    	$http.get(url)
        	.then(function(r){
            	$scope.companyname = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    	
    // $scope.onLoadAll = function(obj){
    // 	$scope.setListHeaders(['Title','Contact Number','Description','Companies','Status']);
    // };
    
});
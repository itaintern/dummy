
/*global angular, app*/
app.controller('releasesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) 
{
    $scope.removeListHeaders = function()
    {
    	return ['is_deleted']
    }
    $rootScope.hideButton = false;

    var projectsurl = H.SETTINGS.baseUrl + '/projects';
     
    	$http.get(projectsurl)
        	.then(function(r)
        	{
            	$scope.projectsdata = r.data;
        	},function(e)
        	{
        		if(e && e.data && e.data.error && e.data.error.status)
        		{
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    
       $scope.newDate = function(Date)
       {
       		$scope.data.single.release_date = H.toMySQLDateTime(Date);
       };
       
});

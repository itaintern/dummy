/*global angular, app*/
app.controller('profilesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['users','companies','employee_number','display_name','join_date','leave_date','birth_date','emergency_number',
    	'secondary_email','address','password','state','country','zipCode','city','is_primary','profile_picture','status','is_deleted']
	}
         $rootScope.hideButton = false;
    var urlCompany = H.SETTINGS.baseUrl + '/companies';
    	$http.get(urlCompany)
        	.then(function(r){
            	$scope.Companydata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlDepartment = H.SETTINGS.baseUrl + '/departments';
    	$http.get(urlDepartment)
        	.then(function(r){
            	$scope.Departmentdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlRole = H.SETTINGS.baseUrl + '/roles';
    	$http.get(urlRole)
        	.then(function(r){
            	$scope.Roledata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlDesignation = H.SETTINGS.baseUrl + '/designations';
    	$http.get(urlDesignation)
        	.then(function(r){
            	$scope.Designationdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
       $scope.newjoinDate = function(Date){
       		$scope.data.single.joinDate = H.toMySQLDateTime(Date);
    	};
    	$scope.newleaveDate = function(Date){
       		$scope.data.single.leaveDate = H.toMySQLDateTime(Date);
    	};
    	$scope.newbirthDate = function(Date){
    		$scope.data.single.birthDate = H.toMySQLDateTime(Date);
    	};
});
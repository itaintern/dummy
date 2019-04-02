app.service('get_apiService', function() {
	
  this.myFunc = function () {
  	var urlDepartment = H.SETTINGS.baseUrl + '/organization_profile';
    	$http.get(urlDepartment)
        	.then(function(response){
                var department_data = response.data;    
            });
    return department_data;
  }
});
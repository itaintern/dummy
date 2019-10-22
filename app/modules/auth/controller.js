/*global app*/
app.controller('authController', function($scope, $rootScope, $http, $location, $cookies, H, M, S) 
{
	if($rootScope.currentUser)
	{
		$location.path('/');
	}
	
	$scope.forms = {};
	$scope.H = H;
	$scope.M = M;
	$scope.S = S;
	
	$scope.data = {};
	
	//$scope.loading = false;
	$scope.login = function()
	{
		//$scope.loading = true;
		$http.post(H.SETTINGS.baseUrl + '/users/login', {email: $scope.email, password: $scope.password})
			.then(function(r)
			{
				//alert(email);
				$scope.error = "";
				 //window.sessionStorage["userInfo"] =r.data.username;
				//JSON.stringify(result.data);
                //$rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                //$localStorage.currentUser = { username: login.username, token: result.data };
                //$http.defaults.headers.common.Authorization = 'Token ' + response.token;
                //$location.path("/dashboard");
            	//window.sessionStorage["userInfo"] = JSON.stringify(result.data);
		    	//if (window.sessionStorage["userInfo"])
		    	//{
    			//$rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
				//}
				//$rootScope.username=r.data.username;
			    //alert('authController box');
		        //alert($rootScope.username);
			    //alert(r.data.username);
				if(!r.data.token)
				{
					$scope.error = M.E500;
					//$scope.loading = false;
					return;
				}
				$rootScope.currentUser = r.data;
			    //alert($rootScope.currentUser);
			    //alert($rootScope.username);
				$cookies.putObject(H.getCookieKey(), JSON.stringify(r.data));
				$location.path('/');
			},
			function(e)
			{
				//alert(e.username);
				if(e && e.data && e.data.error && e.data.error.status)
				{
					if(e.data.error.code == 404 && e.data.error.message == "Not Found")
					{
						$scope.error = M.LOGIN_API_UNAVAILABLE;
					}
					else
					{
						$scope.error = e.data.error.message ? e.data.error.message : e.data.error.status;	
					}
				}
				//$scope.loading = false;
			});
	};
	
	$scope.forgotPassword = function()
	{
		//$scope.loading = true;
		$http.post(H.SETTINGS.baseUrl + '/users/forgot-password', {email: $scope.email})
			.then(function(r)
			{
				$scope.error = M.RECOVERY_EMAIL_SENT;
				//$scope.loading = false;
			},
			function(e)
			{
				if(e && e.data && e.data.error && e.data.error.status)
				{
					if(e.data.error.code == 404 && e.data.error.message == "Not Found")
					{
						$scope.error = M.LOGIN_API_UNAVAILABLE;
					}
					else 
					{
						$scope.error = e.data.error.message ? e.data.error.message : e.data.error.status;
					}
				}
				//$scope.loading = false;
			});
	};

	$scope.register = function(){
		var route = 'users';
		var data = {username: $scope.data.username, email: $scope.data.email, password: $scope.data.password};
		if(S.enableSaaS) {
			route = 'organizations'; 
			data = {organization: $scope.data.organization, email: $scope.data.email};
		}else{
			if($scope.data.password != $scope.data.confirmPassword){
				$scope.error = "Password and Confirm Password should match!";
				return;
			}
		}
		$http.post(H.SETTINGS.baseUrl + '/' + route +'/register', data)
			.then(function(r){
				$scope.error = M.REGISTRATION_EMAIL_SENT;
			}, function(e){
				if(e && e.data && e.data.error && e.data.error.status){
					if(e.data.error.code == 404 && e.data.error.message == "Not Found"){
						$scope.error = M.REGISTER_API_UNAVAILABLE;
					} else {
						$scope.error = e.data.error.message ? e.data.error.message : e.data.error.status;
					}
				}
			});
	};
	
	$scope.logout = function()
	{
		$cookies.remove(H.getCookieKey());
		delete $rootScope.currentUser;
		$location.path('/sign-in');
	};
});



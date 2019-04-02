/*global angular, app*/

app.config(function($routeProvider) {
    $routeProvider

    .when("/load_milestones", {
        templateUrl : "/load_milestones.html",
        controller : "load_milestonesCtrl"
    });
});
app.controller("load_milestonesCtrl", function ($scope) {
  
    $scope.msg = "Data has been added!!";
});

app.controller('tasksController', function($scope, $controller, $rootScope, $http, $location,$mdSidenav, $mdDialog, H, M,$route)
{
	$scope.getarray = [];
	
	$scope.load_all_pro_mile_tasks = function()
	{
		var get_data_id;
		var get_login_email = sessionStorage.getItem("login_email");
		
		$http({
			method:'GET', 
			url:H.SETTINGS.baseUrl+'/profiles?primary_email='+get_login_email+'',
			header:'Content-Type: application/json; charset=UTF-8'
		}).then(function(response){
			$scope.get_pr = response.data;
			get_data_id = response.data[0].id;
			
		/*console.log("id is:");
		console.log(get_data_id);*/
		$http({
			method:'GET',
			url:H.SETTINGS.baseUrl+'/tasks?assignee_id='+get_data_id+'',
			header:'Content-Type: application/json; charset=UTF-8'
		}).then(function(response){
			$scope.all_tasks = response.data;
			var tsk = response.data;
			/*console.log("tasks are");
			console.log(tsk);*/
			if($scope.all_tasks.length>1)
			{
				$scope.show_all_tasks = "true";
			}
			else{
				$scope.show_all_tasks = "true";
			}
		});
		
		$http({
          method : 'GET',
          url : H.SETTINGS.baseUrl+'/projects?profile_id='+get_data_id+'',
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
        	$scope.all_projects  = response.data;
        	var prjct = response.data;
        	//console.log(response.data);
         });
		});
         
         $http({
          method : 'GET',
          url : H.SETTINGS.baseUrl+'/milestones',
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
        	$scope.all_milestones  = response.data;
        	var mlstne = response.data;
         });
	};
	
	
	
	$scope.get_milestone = function(){
		var get_project_id = $scope.project_dd_id;	
			$scope.get_milestone_names='';
		$http({
			method:'GET',
			url: H.SETTINGS.baseUrl+'/milestones?pid='+get_project_id+'', 
		}).then(function(response){
			$scope.get_milestone_names = response.data;
			//console.log($scope.get_milestone_names);
			if($scope.get_milestone_names.length === 0)
			{
			    $scope.milestone_is_null = "No Milestones for this Project";
			}
			else{
			    $scope.milestone_is_null = "";
			}
		});
	};
	
	
		//GET PROJECT NAME
		$scope.get_project_name = function(){
		var get_project_id = $scope.project_dd_id;	
		
		/*console.log(get_project_id);*/
			$scope.get_milestone_names='';
		$http({
			method:'GET',
			url: H.SETTINGS.baseUrl+'/projects?id='+get_project_id+'', 
		}).then(function(response){
		//console.log(response.data.length);
		if(response !== null && response.data.length > 0)
		{
			var ac = response.data[response.data.length - 1].project_name;
			$scope.getarray.push(ac);
		}
	});
	
	};
	
	
	$scope.get_milestone_name = function(){
		var get_milestone_id = $scope.milestone_dd_id;	
		$http({
			method:'GET',
			url: H.SETTINGS.baseUrl+'/milestones?id='+get_milestone_id+'', 
		}).then(function(response){
			$scope.mname = response.data[0];
		});
	};
	
	
	
	$scope.get_tasks = function(){
		var get_milestone_id = $scope.milestone_dd_id;
		$http({
			method:"GET",
			url:H.SETTINGS.baseUrl+'/tasks?MID='+get_milestone_id+'',
		}).then(function(response){
		
			$scope.all_data_tasks = response.data;
			console.log($scope.all_data_tasks);
			if($scope.all_data_tasks.length === 0)
			{
			    $scope.task_is_null = "No Tasks for this Milestone";
			}
			else{
			    $scope.task_is_null = "";
			}
		});
		
	};
	

	

	
});
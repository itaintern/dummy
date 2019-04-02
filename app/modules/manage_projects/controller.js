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

app.controller('manage_projectsController', function($scope, $controller, $rootScope, $http, $location,$mdSidenav, $mdDialog, H, M,$route) {
  $scope.H = H;
  $scope.M = H.M;
  $rootScope.hideButton = true;
   $scope.removeListHeaders = function(){
      return ['is_deleted']
    }
	$scope.open_add_project = function(){
    	$scope.model = {};
		$mdSidenav('component_add_project').open();
    }
    $scope.close_add_project = function(){
    	
		$mdSidenav('component_add_project').close();
		$scope.model = {};
		$route.reload();
    }
    $scope.open_update_project = function(){
		$mdSidenav('component_update_project').open();
    }
    $scope.close_update_project = function(){
		$mdSidenav('component_update_project').close();
		$scope.model = {};
		$route.reload();
    }
    
    $scope.movie = {}
        $scope.projects = []

        $scope.maxSize = 8

        $scope.query = {
            page: 1,
            pageSize: 8
        }
    
    
    
        $http.get(H.SETTINGS.baseUrl+'/projects?is_deleted=0&count=true')
        .then(function (response) {
        $scope.counttt =  response.data[0].count
       
        });

      $scope.selectedIndex = -1;
  
  //Milestone status
  $scope.update_data = {};
  $scope.Status = [
  {value:"Released"},
  {value:"Un-released"},
  {value:"Archieved"}
  ]
  
  $scope.Flag = [
  {value:"Internal"},
  {value:"External"}
  ]
  
  $scope.Task_Status = [
  {value:"Done"},
  {value:"Not Done"}
  ]
  
  $scope.Priority = [
  {value:"None"},
  {value:"Low"},
  {value:"Medium"},
  {value:"High"},
  ]
  
  $scope.enable_add_task = false;
  $scope.checked = 0;
  $scope.myproject_Id = 0;
  $scope.MID = 0;
  $scope.task_value = 0;
  $scope.task_list_id = 0;
  $scope.show_tasks = false;
  $scope.show_milestones = false;
  $scope.row_data = false;
       
       //Add project slider
       
       $scope.insert = function(model){
    	$http.post(H.SETTINGS.baseUrl+'/projects',model).then(function successCallback(response) {
    	$scope.close_add_project();  
    	$mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Project')
        .textContent('Project was added Succesfully!')
        .ariaLabel('Project')
        .ok('OK'));
      
    	$route.reload();
   
      }, function errorCallback(response) {
    	$mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Project')
        .textContent('Project was not added Succesfully!')
        .ariaLabel('Project')
        .ok('OK'))
      });
       
       }
       
       //update projects
       $scope.updateProject = function(id){
         $http({
          method : 'GET',
          url : H.SETTINGS.baseUrl + '/projects/'+id,
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
          
			$scope.model = response.data;
         });
		$scope.open_update_project();
       //to save updated records of projects
        $scope.saveProject = function(model){
		$scope.close_update_project();	
        $http.put(H.SETTINGS.baseUrl+'/projects/'+id,model).then(function(response){
          var isvalid = response.status;
        	$mdDialog.show(
        	$mdDialog.alert()
        	.parent(angular.element(document.querySelector('#popupContainer')))
        	.clickOutsideToClose(true)
	        .title('Project')
    	    .textContent('Project was updated succesfully!')
        	.ariaLabel('Project')
        	.ok('OK'));
          if(isvalid == 200){	
            $route.reload();
          }
        },function errorCallback(response){
			$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#popupContainer')))
			.clickOutsideToClose(true)
			.title('Project')
			.textContent('Project was not updated.')
			.ariaLabel('Project')
			.ok('OK'));
		});
       } 
      }
      
      $scope.delete_data = function(id)
      {
         
               /*$http.put(H.SETTINGS.baseUrl+"/tasks/"+ id, {*/
                   $http.put(H.SETTINGS.baseUrl+'/tasks/', {'id': id,"is_deleted":"1"})
                   .then(function success(data) {
    
                      //Below line displays all the tasks of selected milestone. It doesn't handle the task list
    
                           
                           $http.get(H.SETTINGS.baseUrl+'/tasks?is_deleted=0&MID='+$scope.MID).then(function successCallback(response) {
    
                         $scope.tasks = response.data;
    
                         }, function errorCallback(response) {});
    
                   }, function error(){});
      }
        
    $scope.show_tasks = false;
    $scope.show_milestones = false;
  
    $scope.getDetails = function(v){
    
      $scope.milestones = null;
      $scope.show_tasks = false;
      $scope.row_data = false;
      var id = event.target.id;
      $scope.myproject_Id = id;
      if($scope.project_Id != id ){
        $scope.project_Id = id;
        
      $http.get(H.SETTINGS.baseUrl+'/milestones?pid='+id+'&is_deleted=0').then(function successCallback(response) {
        $scope.milestones = response.data;
      }, function errorCallback(response) {

      $scope.project = response.data;
     
    
      });
      }
      else{
        $scope.project_Id = 0;        
    }
    
    }

     
    $http.get(H.SETTINGS.baseUrl+'/employees').then(function(response){
      $scope.emp_responsible = response.data;
      
      
    });
    $scope.addMilestone = function(evnt){ 
      
          var mydata = {
        milestone_name :$rootScope.milestone_name,
      estimated_start_date:$rootScope.estimated_start_date,
          estimated_end_date:$rootScope.estimated_end_date,
          status_value:$rootScope.status_value,  
        profile_id : $scope.emp_milestone_id,
        pid : $scope.myproject_Id,
      flag:$rootScope.flag
      }
      $http.post(H.SETTINGS.baseUrl+'/milestones',mydata).then(function successCallback(response) {
      $http.get(H.SETTINGS.baseUrl+'/milestones?pid='+$scope.myproject_Id).then(function successCallback(response) {
                $scope.milestones = response.data;
                 }, function errorCallback(response) {});
      var tabs = $scope.milestones;
      $scope.tabs = tabs;
      tabs.push(mydata)
      
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Milestone Adding')   
        .textContent('Milestone added Succesfully!')
        .ariaLabel('New Milestone')
        .ok('OK')
          .openFrom({
          top: -50,
          width: 30,
          height: 80
        })
        .closeTo({
          left: 1500
        })
        
        
      );
      document.getElementById('myMilestone').reset();
      
      
      }, function errorCallback(response) {
     
      
      });
    $mdSidenav('milestone').close();
    }
  
    //deleting projects
    $scope.delete_data1 = function(id1){
      $http({
      method : 'PUT',
      url : H.SETTINGS.baseUrl+'/projects',
      data : {
        "id" : id1,
        "is_deleted" : "1"
        },
      header : 'Content-Type: application/json; charset=UTF-8'
    }).then(function(response){
      var isdelete = response.status;
      if(isdelete == 200)
      {
        
        
        $route.reload();
      }
      else
      {
        
      }
    });
};

  $scope.addTaskList = function(evnt){

          var data = {
        pid:$scope.myproject_Id,
      name:$rootScope.task_list,
      mid:$scope.MID
      }
      $http.post(H.SETTINGS.baseUrl+'/project_lists',data).then(function successCallback(response) {
        
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Task List Adding')
        .textContent('Task List added Succesfully!')
        .ariaLabel('New Task List')
        .ok('OK')
        );
      
      
      }, function errorCallback(response) {}
      );
    }

    $http({
      method : 'GET',
      url : H.SETTINGS.baseUrl + '/employees',
      header : 'Content-Type: application/json; charset=UTF-8'
  }).then(function(response){
  $scope.incharges2 = response.data;
  });

  $http({
      method : 'GET',
      url : H.SETTINGS.baseUrl + '/employees',
      header : 'Content-Type: application/json; charset=UTF-8'
  }).then(function(response){
$scope.reporters2 = response.data;
  });

    $scope.addTask = function(evnt){
      
      var tl = $rootScope.task_list;
      
    if(tl == null){
      $rootScope.task_list = 0;
    }
        var data={};
       data={
        title:evnt.task_title,
        assignee_id: evnt.assignee_id,
        reporter_id : evnt.reporter_id,
        project_lists_id: evnt.task_list,
        task_details:evnt.task_details,
        task_status:evnt.task_status,
        start_date:evnt.estimated_start_date,
        end_date:evnt.estimated_end_date,
        
        priority:evnt.priority,
        MID:$scope.MID,
      }
      $http.post(H.SETTINGS.baseUrl+'/tasks',data).then(function successCallback(response) {
      document.getElementById('myTask').reset()
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Task Adding')
        .textContent('Task was added Succesfully!')
        .ariaLabel('New Task')
        .ok('OK')
 
      );
 
      //Automatically display the recently added task

      var string = ""+$scope.task_value;
      if(string.localeCompare("undefined") != 0){
        $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+$scope.MID+'&project_lists_id='+$scope.task_value).then(function successCallback(response) {
        $scope.tasks = response.data;
        
        }, function errorCallback(response) {
        	
        $scope.project = response.data;
        });
      }
      else{
        $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+$scope.MID).then(function successCallback(response) {
        $scope.tasks = response.data;
        
        }, function errorCallback(response) {
        	
        $scope.project = response.data;
        });
      }
          
      }, function errorCallback(response) {});
      
      $mdSidenav('task').close();
    }

    //update task
          
    $scope.updateTask = function(update_id){
      $mdSidenav('update_task').open();
          $http({
            method:"GET",
            url:H.SETTINGS.baseUrl + '/tasks?id='+update_id+'',
            header : 'Content-Type: application/json; charset=UTF-8'
          }).then(function(response){
  
            var data1 = response.data[0];
           
            
            
            $scope.update_data.get_title = data1.title;
            $scope.update_data.get_task_details = data1.task_details;
            
            $scope.update_data.get_priority = data1.priority;
            $scope.update_data.get_task_status = data1.task_status;
            $scope.update_data.get_in_charge = data1.display_name;
            
            $scope.update_data.get_reporter_id = response.data[0].reporter.id;
            $scope.update_data.get_reporter_display_name = response.data[0].reporter.display_name;
            
            $scope.update_data.get_assignee_id = response.data[0].assignee.id;
            
            $scope.update_data.get_assignee_display_name = response.data[0].assignee.display_name;
            $scope.update_data.get_start_date = data1.start_date;	
            $scope.update_data.get_end_date = data1.end_date;
            
            $scope.update_data.get_mi_id = response.data[0].MID.id;
            $scope.update_data.get_milestone_name = response.data[0].MID.milestone_name;
            
          });  
          
         $scope.save_updated_task = function(insert_data)
         {
         
         $http({
        method:"PUT",
          url:H.SETTINGS.baseUrl+'/tasks/'+update_id+'', 
          data:
          {
            "title":insert_data.get_title,
            "task_details":insert_data.get_task_details,
            "reporter_id":insert_data.get_reporter_id,
            "assignee_id":insert_data.get_assignee_id,
            "start_date":insert_data.get_start_date,
            "end_date":insert_data.get_end_date,
            "priority":insert_data.get_priority,
            "task_status":insert_data.get_task_status
          },
          header : 'Content-Type: application/json; charset=UTF-8'
           }).then(function(response){
          var isdelete = response.status;
          if(isdelete == 200)
          {
           
            $route.reload();
          }
          else
          {
         
          }
        });
    };
    };
        
			
  

    
    //delete milestone
    $scope.delete_milestone = function(id){
      $http({
        method:"PUT",
        url:H.SETTINGS.baseUrl + '/milestones',
        data : {
          "id" : id,
          "is_deleted" : "1"
        },
        header : 'Content-Type: application/json; charset=UTF-8'
      }).then(function(response){
        var isdelete = response.status;
        if(isdelete == 200)
        {
         
          $route.reload();
        }
        else
        {
         
        }
      });
    };
  
  
  $scope.newTaskList = function(evnt) {
        
        
               $mdDialog.show ({
                  clickOutsideToClose: true,
          
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'add_task_list.html',
                  controller: function DialogController($scope, $mdDialog) {
                     $scope.closeDialog = function() {
                        $mdDialog.hide();
                     }
                  }
               });
            };      
  
    $scope.cancel = function(){$mdDialog.cancel();}
    
    $scope.getTasks = function( mile, pl){
   
    $scope.show_tasks = true;
      $scope.task_list_id = pl;
      
      var id = event.target.id;
      
      if($scope.milestone_Id != id ){
        $scope.milestone_Id = id;
      $scope.show_tasks = false;
      $scope.task_value = pl;
      $scope.MID = mile;
      var string = ""+pl;
      
      if(string.localeCompare('undefined') != 0){
        $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+mile+'&project_lists_id='+pl).then(function successCallback(response) {
        $scope.tasks = response.data;
        $scope.show_tasks = true;


        }, function errorCallback(response) {
        
        $scope.project = response.data;
        });
      }
      else{
        $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+mile).then(function successCallback(response) {
        $scope.tasks = response.data;
        $scope.show_tasks = true;

        
        }, function errorCallback(response) {
        
        $scope.project = response.data;
        });
      }
    
    }
      else{
        $scope.milestone_Id = 0;
      $scope.show_tasks = false;
    }
    $scope.checked = $scope.milestone_Id;
    
      
      
      
    }
  
  $scope.getReleases = function(v){
    $scope.milestonesSelectedIndex = -1;
    $scope.show_tasks = false;
    $scope.getTasks(v,"undefined")
      $scope.newtask = true;
      
      var id = event.target.id;
     
  
      $scope.MID = v;
      
      $http.get(H.SETTINGS.baseUrl+'/project_lists?mid='+v).then(function successCallback(response) {
        $scope.Releases = response.data;
      
      $scope.show_tasks = true;

      }, function errorCallback(response) {
      
      $scope.project = response.data;
      });
    
      
    }

    //getting data for in-charges in dropdown
    
    $http({
			method : 'GET',
			url : H.SETTINGS.baseUrl + '/profiles?roles=admin',
			header : 'Content-Type: application/json; charset=UTF-8'
		}).then(function(response){
      $scope.inCharges = response.data;
		});

    
    
    var urlClient = H.SETTINGS.baseUrl + '/projects?is_deleted=0&order=project_name&orderType=asc';
      $http.get(urlClient)
          .then(function(r){
              $scope.Clientdata = r.data;
            
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
      
    var urlUsers = H.SETTINGS.baseUrl + '/employees';
      $http.get(urlUsers)
          .then(function(r){
              $scope.Users = r.data;
        
        
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
          
    //star-end date validation
    	$scope.minDate = new Date();
    	$scope.maxDate = new Date();
    	$scope.maxDate.setDate($scope.minDate.getDate() + 1);
    	
      $scope.add_estimated_start_date = function(Date){
	  $scope.estimated_start_date = H.toMySQLDateTime(Date);
          
      };
      $scope.add_estimated_end_date = function(Date){
          $scope.estimated_end_date = H.toMySQLDateTime(Date);
          
      };
      
      $scope.update_estimated_start_date = function(Date){
          $scope.estimated_start_date_update = H.toMySQLDateTime(Date);
      };
      $scope.update_add_estimated_end_date = function(Date){
          $scope.estimated_end_date_update = H.toMySQLDateTime(Date);
      };
    $scope.newMilestone = function() {
               $mdSidenav('milestone').toggle();
            };
    
    $scope.closeMilestone = function(){
      $mdSidenav('milestone').close();
      document.getElementById('myMilestone').reset()
    }
    

    //update milestone
    $scope.update_Milestone = function(id){
      $mdSidenav('updateMilestone').open();
      

      $http({
        method : 'GET',
        url : H.SETTINGS.baseUrl + '/milestones/'+id,
        header : 'Content-Type: application/json; charset=UTF-8'
      }).then(function(response){
      
        $rootScope.milestone_name_update = response.data.milestone_name;
        $rootScope.emp_milestone_update = response.data.profile_id;
        $rootScope.estimated_start_date_update = response.data.estimated_start_date;
        $rootScope.estimated_end_date_update = response.data.estimated_end_date;
        $rootScope.status_value_update = response.data.status_value;
        $rootScope.flag_update = response.data.flag;
       }); 
      


    //to save updated records of milestone
    $scope.saveMilestone = function(){
      $http({
        method : 'put',
        url : H.SETTINGS.baseUrl+'/milestones/'+id,
        header : 'Content-Type: application/json; charset=UTF-8',
        data: {
          "milestone_name" : $rootScope.milestone_name_update,
          "profile_id" : $rootScope.emp_milestone_update,
          "estimated_start_date" : $rootScope.estimated_start_date_update,
          "estimated_end_date" : $rootScope.estimated_end_date_update,
          "status_value" : $rootScope.status_value_update,
          "flag" : $rootScope.flag_update
        }
      }).then(function(response){
        var isvalid = response.status;
        if(isvalid == 200){
          $route.reload();
        }
       
      });
     } 
    }

    $scope.closeUpdateMilestone = function(){
      $mdSidenav('updateMilestone').close();
      document.getElementById('updateMilestone_form_id').reset();
    }
    
    $scope.newTask = function() {
        $rootScope.task_list = $scope.task_list_id;
        $scope.blocked_value = "true";
               $mdSidenav('task').toggle();
            };
      
    $scope.newTaskAdd = function() {
        $rootScope.task_list = null;
        $scope.blocked_value = "false";
        $mdSidenav('task').toggle();
            };
    
    $scope.closeTask = function(){
      $mdSidenav('task').close();
      document.getElementById('myTask').reset();
    }
 
    
    $scope.closeTask1 = function(){
      $mdSidenav('update_task').close();
      document.getElementById('myTask').reset();
    
    }
});


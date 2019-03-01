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

app.controller('manage_projectsControllerExtension', function($scope, $controller, $rootScope, $http, $location,$mdSidenav, $mdDialog, H, M,$route) {
  
  $rootScope.hideButton = true;
   $scope.removeListHeaders = function(){
      return ['is_deleted']
    }
  
  $scope.selectedIndex = -1;
  
  //Milestone status
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
       
       
       $scope.insert = function(){
        var data={};
        data = {
               clients_id:$rootScope.clients_id,
             project_name: $rootScope.project_name,
             project_description:$rootScope.project_description,
             estimated_start_date:$rootScope.estimated_start_date,
             estimated_end_date:$rootScope.estimated_end_date,
             version:$rootScope.version,
             type:$rootScope.flag,
         

      }
      //console.log("data",data)
      $http.post(H.SETTINGS.baseUrl+'/projects',data).then(function successCallback(response) {
        document.getElementById('myProject').reset()
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Project Adding')
        .textContent('Project was added Succesfully!')
        .ariaLabel('Project Adding')
        .ok('OK')
        
      );
      
      /* $scope.reload = function(){
        var urlClient = H.SETTINGS.baseUrl + '/projects';
        $http.get(urlClient)
          .then(function(r){
            $scope.Clientdata = r.data;
            
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
      }; */
      $scope.reload();
      var promise = $interval($scope.reload, 1000);
      $interval.cancel(promise);
      }, function errorCallback(response) {
      //console.log('project was not added Succesfully')
      
      });
      
      document.getElementById('myProject').reset();
      $mdSidenav('project').close();
      
    
     
       }
       
       //update projects
       $scope.updateProject = function(id){
        $mdSidenav('updateProject').toggle();
         console.log("Update id"+id);
         $http({
          method : 'GET',
          url : H.SETTINGS.baseUrl + '/projects/'+id,
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
          //console.log("Updated Data"+JSON.stringify(response.data));
          $rootScope.project_name_update = response.data.project_name;
          $rootScope.clients_id_update = response.data.clients_id;
          $rootScope.project_description_update = response.data.project_description;
          $rootScope.estimated_start_date_update = response.data.estimated_start_date;
          $rootScope.estimated_end_date_update = response.data.estimated_end_date;
          $rootScope.version_update = response.data.version;
          $rootScope.flag_update = response.data.type;
         });

       //to save updated records of projects
        $scope.saveProject = function(){
        $http({
          method : 'put',
          url : H.SETTINGS.baseUrl+'/projects/'+id,
          header : 'Content-Type: application/json; charset=UTF-8',
          data: {
            "project_name" : $rootScope.project_name_update,
            "clients_id" : $rootScope.clients_id_update,
            "project_description" : $rootScope.project_description_update,
            "estimated_start_date" : $rootScope.estimated_start_date_update,
            "estimated_end_date" : $rootScope.estimated_end_date_update,
            "version" : $rootScope.version_update,
            "type" : $rootScope.flag_update,
          }
        }).then(function(response){
          var isvalid = response.status;
          if(isvalid == 200){
            //alert("Updated");
            $route.reload();
          }
          else{
            alert("Something went wrong");
          }
        });
       } 
      }


       $scope.closeUpdateSlieder = function(){
        $mdSidenav('updateProject').close();
        document.getElementById('update_form_id').reset()
      }
   
   $scope.delete_data = function(id){
    if (confirm("Are you sure you want to delete?")) {
            $http.delete(H.SETTINGS.baseUrl+"/tasks/"+ id, {
                    'id': id
                })
                .then(function success(data) {
                   
                   //Below line displays all the tasks of selected milestone. It doesn't handle the task list
                    $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+$scope.MID).then(function successCallback(response) {

                      $scope.tasks = response.data;
                      
                      }, function errorCallback(response) {});
          
                }, function error(){});
        } 
    else {
            return false;
        }
   }
        
    $scope.show_tasks = false;
    $scope.show_milestones = false;
  
    $scope.getDetails = function(v){
    //console.log("india "+v)
      
      $scope.show_tasks = false;
      $scope.row_data = false;
      var id = event.target.id;
      $scope.myproject_Id = id;
      if($scope.project_Id != id ){
        $scope.project_Id = id;
        
      $http.get(H.SETTINGS.baseUrl+'/milestones?PID='+id).then(function successCallback(response) {
        $scope.milestones = response.data;
        
      //console.log($scope.milestones[0].id);
      //  $scope.getReleases($scope.milestones[0].id);
      }, function errorCallback(response) {

      $scope.project = response.data;
      //console.log(response);
    //  $scope.project = response.data;
      });
      }
      else{
        $scope.project_Id = 0;        
    }
    
    }
    
    $scope.addMilestone = function(evnt){ 
          var mydata = {
        milestone_name :$rootScope.milestone_name,
      estimated_start_date:$rootScope.estimated_start_date,
          estimated_end_date:$rootScope.estimated_end_date,
          status_value:$rootScope.status_value,  
        PID : $scope.myproject_Id,
      flag:$rootScope.flag
      }
      $http.post(H.SETTINGS.baseUrl+'/milestones',mydata).then(function successCallback(response) {
      $http.get(H.SETTINGS.baseUrl+'/milestones?PID='+$scope.myproject_Id).then(function successCallback(response) {
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
      console.log('Milestone was not added Succesfully')
      
      });
    $mdSidenav('milestone').close();
    }
  
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
    
    $scope.addTask = function(evnt){
      var tl = $rootScope.task_list;
    if(tl == null){
      $rootScope.task_list = 0;
    }
        var data={};
       data={
        title:$rootScope.task_title,
        assignee_id: $rootScope.assignee_id,
        reporter_id : $rootScope.reporter_id,
        project_lists_id: $rootScope.task_list,
        task_details:$rootScope.task_details,
        status:$rootScope.status,
        priority:$rootScope.priority,
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
        console.log($scope.tasks.length)
        }, function errorCallback(response) {
        	console.log("Not added")
        $scope.project = response.data;
        });
      }
      else{
        $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+$scope.MID).then(function successCallback(response) {
        $scope.tasks = response.data;
        console.log($scope.tasks.length)
        }, function errorCallback(response) {
        	console.log("Not added")
        $scope.project = response.data;
        });
      }
          
      }, function errorCallback(response) {});
      
      $mdSidenav('task').close();
    }
    
  $scope.newTaskList = function(evnt) {
        
        console.log($scope.MID)
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
      console.log('MID is '+mile+' task list id is '+pl)
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

        console.log($scope.tasks.length)
        }, function errorCallback(response) {
        
        $scope.project = response.data;
        });
      }
      else{
        $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+mile).then(function successCallback(response) {
        $scope.tasks = response.data;
        $scope.show_tasks = true;

        console.log($scope.tasks.length)
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
    console.log('mid is '+id)
      
      
      
    }
  
  $scope.getReleases = function(v){
    $scope.milestonesSelectedIndex = -1;
    $scope.show_tasks = false;
    $scope.getTasks(v,"undefined")
      $scope.newtask = true;
      
      var id = event.target.id;
      console.log(v+" is id")
    
  
      $scope.MID = v;
      
      $http.get(H.SETTINGS.baseUrl+'/project_lists?mid='+v).then(function successCallback(response) {
        $scope.Releases = response.data;
      console.log($scope.Releases)
      $scope.show_tasks = true;

      }, function errorCallback(response) {
      
      $scope.project = response.data;
      });
    
      
    }
    
    
    var urlClient = H.SETTINGS.baseUrl + '/projects';
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
    
    
       $scope.newestimatedStartDate = function(Date){
          $scope.data.single.estimated_start_date = H.toMySQLDateTime(Date);
      };
      $scope.newestimatedEndDate = function(Date){
          $scope.data.single.estimated_end_date = H.toMySQLDateTime(Date);
      };
    
    $scope.newMilestone = function() {
               $mdSidenav('milestone').toggle();
            };
    
    $scope.closeMilestone = function(){
      $mdSidenav('milestone').close();
      document.getElementById('myMilestone').reset()
    }
    
    $scope.newTask = function() {
        $rootScope.task_list = $scope.task_list_id;
        $scope.blocked_value = "true";
        console.log($scope.task_list_id+ " is my value")
               $mdSidenav('task').toggle();
            };
      
    $scope.newTaskAdd = function() {
        $rootScope.task_list = null;
        $scope.blocked_value = "false";
        $mdSidenav('task').toggle();
            };
    
    $scope.closeTask = function(){
      $mdSidenav('task').close();
      document.getElementById('myTask').reset()
    }
    
    $scope.newProject = function() {
               $mdSidenav('project').toggle();
            };
    
    $scope.closeProject = function(){
      $mdSidenav('project').close();
      document.getElementById('myProject').reset()
    }
    
});


function RegisterMenuItems(){
    return [
        {
            header: '',
            showHeader: false,
            showSeparator: false,
            items: [
        	    {action: '', icon: 'home', color: 'blue', text: 'Home'}
	        ],
	        allowedRoles: ['user', 'admin', 'superadmin']
        },
        {
            header: '',
            showHeader: false,
            showSeparator: false,
            items: [
        	    {action: 'tasks', icon: 'assignment_turned_in', color: 'green', text: 'Tasks'},
        	    {action: 'members', icon: 'people', color: 'green', text: 'Members'},
        	    //{action: 'search', icon: 'search', color: 'brown', text: 'Search'},
        	     {action: '', icon: 'event_note', color:'green',text: 'Projects',
        	    	items : [
        	    		{action: 'projects', icon: 'event_note', color: 'green', text: 'Manage Projects (New)'},
        	    		{action: 'releases', icon: '',text: 'Manage Release (Old)'},
        	    		{action: 'test_cases', icon: '',text: 'Test Cases (Old)'},
        	    		{action: 'test_plans', icon: '',text: 'Test Plans (Old)'},
        	    		{action: 'test_executions', icon: '',text: 'Test Executions (Old)'}
        	    	]
        	    },
        	    
        	    
        	    {action: '', icon: 'grid_on', color:'orange',text: 'Courses',
        	    	items : [
        	    		{action: 'modules', icon: '',text: 'Module'},
        	    		{action: 'manage_courses', icon: '',text: 'Manage Course'},
        	    		{action: 'manage_batches', icon: '',text: 'Manage Batches'}
        	    	]
        	    },
        	    
        	    {action: '', icon: 'question_answer', color:'brown',text: 'Quizzes',
        	    	items : [
        	    		{action: 'question_banks', icon: '',text: 'Question Bank'},
        	    		{action: 'question_sets', icon: '',text: 'Question Sets'},
        	    		{action: 'add_questions', icon: '',text: 'Add Question'},
						{action: 'manage_quizes', icon: '',text: 'Manage Quizes'},
						{action: 'schedule_quizes', icon: '',text: 'Schedule Quizes'}
        	    	]
        	    },
        	    
        	    {action: '', icon: 'time_to_leave', color:'blue',text: 'Leaves',
        	    	items : [
        	    		{action: 'company_holidays', icon: '',text: 'Holidays'},
        	    		{action: 'leave_requests', icon: '',text: 'My Leaves'},
        	    		{action: 'leaveRequests', icon: '',text: 'Response Leave'}
        	    	]
        	    },
        	    
        	    {action: 'reports', icon: 'pie_chart', color: 'purple', text: 'Reports'},
        	    
        	    {action: 'alerts', icon: 'alarm', color: 'red', text: 'Alerts'}
        	    
        	    // {action: '', icon: 'person', color:'cyan', text: 'Administrations',
        	    // 	items : [
        	    // 	    {action: 'profiles', icon: '',text: 'Profiles'},
        	    		
        	    // 	]
        	    // }
	        ],
	        allowedRoles: ['user', 'admin']
        },
        {
            header: 'Administration',
            showHeader: true,
            showSeparator: true,
            items: [
        	    {action: 'settings', icon: 'settings', color: 'yellow', text: 'Settings'},
        	    {action: 'categories', icon: 'list', color: 'orange', text: 'Categories'},
        	    {action: 'departments', icon: 'view_comfy', color:"", text: 'Departments'},
        	    {action: 'users', icon: 'person', color: 'blue', text: 'Users'},
        	    {action: 'groups', icon: 'group', color: 'green', text: 'Groups'},
        	    {action: 'profiles', icon: 'account_circle', color: 'bg-orange', text: 'Profiles'}
	        ],
	        allowedRoles: ['admin']
        },
        {
            header: 'Customer Management',
            showHeader: false,
            showSeparator: false,
            items: [
        	    {action: 'organizations', icon: 'people_outline', color: '', text: 'Organizations'}
	        ],
	        allowedRoles: ['superadmin']
        }
    ];
}
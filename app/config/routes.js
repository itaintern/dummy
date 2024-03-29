function RegisterRoutes() {
    return {
        customRoutes: [
            {route: '', template: 'home/template', controller: 'home'},
            {route: 'sign-in', template: 'auth/sign-in', controller: 'auth', auth: false},
            {route: 'forgot-password', template: 'auth/forgot-password', controller: 'auth', auth: false},
            {route: 'register', template: 'auth/register', controller: 'auth', auth: false},
            {route: 'profile', template: 'auth/profile', controller: 'profile'},
            {route: 'unauthorized', template: 'auth/unauthorized', controller: 'unauthorized'},
            {route: 'out-of-service', template: 'auth/out-of-service', controller: 'outOfService', auth: false},
            {route: 'settings', template: 'settings/template', controller: 'settings'},
            //////////////////////////////////////////////////////////////////////////////
            {route: 'companies', template: 'auth/companies', controller: 'companies'},
            
             {route: 'manage_projects', template: 'auth/manage_projects', controller: 'manage_projects'},
            
            {route: 'company_holidays', template: 'auth/company_holidays', controller: 'company_holidays'},
            {route: 'company_modules', template: 'auth/company_modules', controller: 'company_modules'},
            {route: 'add_questions', template: 'auth/add_questions', controller: 'add_questions'},
            {route: 'appreciations', template: 'auth/appreciations', controller: 'appreciations'},
            {route: 'assign_projects', template: 'auth/assign_projects', controller: 'assign_projects'},
            {route: 'clients', template: 'auth/clients', controller: 'clients'},
            {route: 'course_modules', template: 'auth/course_modules', controller: 'course_modules'},
            {route: 'departments', template: 'auth/departments', controller: 'departments'},
            {route: 'designations', template: 'auth/designations', controller: 'designations'},
            {route: 'projects', template: 'auth/projects', controller: 'projects'},
            {route: 'releases', template: 'auth/releases', controller: 'releases'},
            {route: 'test_cases', template: 'auth/test_cases', controller: 'test_cases'},
            {route: 'test_plans', template: 'auth/test_plans', controller: 'test_plans'},
            {route: 'test_executions', template: 'auth/test_executions', controller: 'test_executions'},
            {route: 'user_stories', template: 'auth/user_stories', controller: 'user_stories'},
            {route: 'documents', template: 'auth/documents', controller: 'documents'},
            {route: 'employees', template: 'auth/employees', controller: 'employees'},
            {route: 'question_banks', template: 'auth/question_banks', controller: 'question_banks'},
            {route: 'leave_requests', template: 'auth/leave_requests', controller: 'leave_requests'},
            {route: 'modules', template: 'auth/modules', controller: 'modules'},
            {route: 'manage_courses', template: 'auth/manage_courses', controller: 'manage_courses'},
            {route: 'manage_batches', template: 'auth/manage_batches', controller: 'manage_batches'},
            {route: 'question_sets', template: 'auth/question_sets', controller: 'question_sets'},
            {route: 'manage_quizes', template: 'auth/manage_quizes', controller: 'manage_quizes'},
            {route: 'schedule_quizes', template: 'auth/schedule_quizes', controller: 'schedule_quizes'},
            {route: 'search', template: 'auth/search', controller: 'search'},
            {route: 'reports', template: 'auth/reports', controller: 'reports'},
            {route: 'alerts', template: 'auth/alerts', controller: 'alerts'}
        ],
        easyRoutes: ['organizations', 'users', 'groups', 'categories', 'tasks',
        			'profiles', 'departments','projects','companies','company_holidays','company_modules',
        			'add_questions','appreciations','assign_projects','clients','course_modules','designations','releases',
        			'test_cases','test_plans','test_executions','user_stories','documents','employees','question_banks',
        			'leave_requests','modules','manage_courses','manage_batches','question_sets','manage_quizes',
        			'schedule_quizes','search','reports','alerts','members','manage_projects']
    };
}
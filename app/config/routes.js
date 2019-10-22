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
            {route: 'settings', template: 'settings/template', controller: 'settings'}
        ],
        easyRoutes: ['alerts','add_questions','departments','organizations', 'users', 'groups', 'categories', 'company_holidays','tasks','projects',
        'releases','schedule_quizes','test_cases','test_plans','test_executions',
        'course_modules','modules','courses','batches','question_banks',
        'question_sets','quizzes','leave_requests']
    };
}
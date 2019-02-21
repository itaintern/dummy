/*global app*/
app.service('S', function($http) {
	return {
		"baseUrl": "../../../../../prestige/api",
		"productName": "weSuite",
		"supportEmail": "support@prestigeframework.com",
		"enableSaaS": true,
		"openRegistration": true,
		"legacyMode": false
	}
});
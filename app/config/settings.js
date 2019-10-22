/*global app*/
app.service('S', function($http) {
	return {
		"baseUrl": "../../../api",
		"productName": "BizSuite",
		"supportEmail": "support@itatonce.in",
		"enableSaaS": true,
		"openRegistration": true,
		"legacyMode": false
	}
});
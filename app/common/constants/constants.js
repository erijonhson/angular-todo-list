(function () {
    'use strict';
    const apiRoot = 'https://task-manager-elife.herokuapp.com/api';
    angular.module('app')

            .constant('APP_AUTHOR', 'Eri Jonhson')
            .constant('APP_NAME', 'angular-todo-list')
            .constant('APP_VERSION', '0.1.5')
            .constant('API_URIS', {
            	TODO: apiRoot + '/v1/tasks/',
            	SIGNUP: apiRoot + '/v1/users/',
            	LOGIN: apiRoot + '/v1/users/sign_in'
        	});
})();

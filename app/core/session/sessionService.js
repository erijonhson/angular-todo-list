(function () {
    'use strict';

    angular.module('app.sessionService', ['app.user'])

            .service('sessionService', sessionService);

    sessionService.$inject = ['User', '$http'];
    function sessionService(User, $http) {
        var vm = this;
        let loggedUser;

        const ENDPOINT_LOGIN = "https://task-manager-elife.herokuapp.com/api/v1/users/sign_in";
        const ENDPOINT_SIGNUP = "https://task-manager-elife.herokuapp.com/api/v1/users/";
        // const ENDPOINT_LOGIN = "http://0.0.0.0:3000/api/v1/users/sign_in";
        // const ENDPOINT_SIGNUP = "http://0.0.0.0:3000/api/v1/users/";

        vm.login = function(user) {
            return $http.post(ENDPOINT_LOGIN, user).then(function(data) {
                loggedUser = new User(data.data);
                saveUserOnCache();
                var result = { data: loggedUser };
                return result;
            });
        };

        vm.signUp = function(user) {
            return $http.post(ENDPOINT_SIGNUP, user).then(function(data) {
                loggedUser = new User(data.data);
                var result = { data: loggedUser };
                return result;
            });
        };

        vm.getLoggedUser = function() {
            return loggedUser;
        };

        vm.logout = function() {
            loggedUser = null;
            removeUserFromCache();
        };

        function removeUserFromCache() {
            localStorage.setItem('loggedUser', null);
        }

        function saveUserOnCache() {
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        }

        function getUserFromCache() {
            const userStr = localStorage.getItem('loggedUser');
            if (!userStr) {
                return undefined;
            }
            return JSON.parse(userStr);
        }

        (function() {
            const cacheUser = getUserFromCache();
            if (cacheUser) {
                loggedUser = new User(cacheUser);
            }
        })();
    }
})();
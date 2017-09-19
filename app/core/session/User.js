(function () {
    'use strict';

    angular.module('app.user', [])

            .factory('User', user);

    user.$inject = ['$q', '$http'];

    /**
     * Represents a User of the app.
     */
    function user($q, $http) {

        const User = function (data) {
            if (!!data) {
                this.id = data.id;
                this.name = data.name;
                this.email = data.email;
                this.token = data.auth_token;
            }
        }

        User.prototype.constructor = User;

        User.prototype.getData = function () {
            return {
                name: this.name,
                email: this.email,
                password: this.password,
                token: this.token
            };
        };

        return User;
    }
})();
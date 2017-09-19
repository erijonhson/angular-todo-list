(function () {
    'use strict';

    angular.module('app.session', ['ui.router', 'app.sessionService', 'toastr'])

            .controller('SessionController', SessionController);

    SessionController.$inject = ['$state', 'sessionService', 'toastr'];

    function SessionController($state, sessionService, toastr) {
        var vm = this;
        let ERROR = 'Favor verifique suas credencias.';

        vm.user = {};
        vm.dataLoading = false;
 
        vm.signup = function (user) {
            vm.dataLoading = true;
            vm.user = angular.copy(user);
            vm.user.password = md5(user.password);
            sessionService.signUp(vm.user)
              .then(function(resp) {
                  console.log(resp);
                  toastr.success('Cadastro realizado com sucesso! Faça login para continuar...');
                  $state.go('root.signin');
              })
              .catch(function(resp) {
                  console.log(resp);
                  toastr.error(resp.data.errors !== undefined ? resp.data.errors : ERROR);
                  vm.dataLoading = false;
                  $state.reload();
              });
        }

        vm.signin = function (user) {
            vm.dataLoading = true;
            vm.user = angular.copy(user);
            vm.user.password = md5(user.password);
            sessionService.login(vm.user)
                .then(function(resp) {
                    console.log(resp);
                    toastr.success('Olá ' + resp.data.name);
                    $state.go('root.todos.list');
                })
                .catch(function(resp) {
                    console.log(resp);
                  toastr.error(resp.data.errors !== undefined ? resp.data.errors : ERROR);
                    vm.dataLoading = false;
                    $state.reload();
                });
        };
    }
})();

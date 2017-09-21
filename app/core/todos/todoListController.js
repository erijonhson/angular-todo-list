(function () {
    'use strict';

    angular.module('app.todos.list', ['ngAnimate', 'app.todo', 'app.sessionService', 'toastr'])

            .controller('TodosListController', TodosListController);

    TodosListController.$inject = ['Todo', 'sessionService', '$state', '$timeout', 'toastr'];

    function TodosListController(Todo, sessionService, $state, $timeout, toastr) {

        var vm = this;
        vm.currentUser = sessionService.getLoggedUser();

        vm.getTodos = function() {
            return vm.currentUser.todos;
        }

        vm.deleteTodo = function (todo) {
            vm.currentUser.deleteTodo(todo).then(function() {
                $state.go('root.todos.list');
            })
            .catch(function error(e) {
                var message = e.errors ? e.errors : 
                    'Erro ao deletar a tarefa.';
                toastr.error(message);
                return $q.reject(message);
            });
        }

    }
})();

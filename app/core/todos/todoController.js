(function () {
    'use strict';

    angular.module('app.todos.change', ['ui.router', 'ngAnimate', 'app.todo', 'app.sessionService'])

            .controller('TodosChangeController', TodosChangeController);

    TodosChangeController.$inject = ['$http', '$stateParams', '$state', 'Todo', 'sessionService', 'toastr', '$filter'];

    function TodosChangeController($http, $stateParams, $state, Todo, sessionService, toastr, $filter) {

        var vm = this;
        vm.todo = new Todo();
        vm.todos = [];
        vm.currentUser = sessionService.getLoggedUser();

        (function() {
            if ($stateParams.todo) {
                vm.todo = new Todo($stateParams.todo);
                vm.todo.deadline = $filter('date')(vm.todo.deadline,'dd/MM/yyyy');
            }
        })();

        vm.addOrUpdateTodo = function (todo) {
            return vm.currentUser.addOrUpdateTodo(todo).then(function(data) {
                $state.go('root.todos.list');
            })
            .catch(function(e) {
                var message = e.errors ? e.errors : 
                    'Erro ao adicionar ou atualizar a tarefa.';
                toastr.error(message);
                return $q.reject(message);
            });
        }

    }
})();

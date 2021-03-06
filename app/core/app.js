(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'angular-loading-bar',
        'toastr',
        'app.nav.breadcrumbs',
        'app.nav.footer',
        'app.nav.header',
        'app.nav.menu',
        'app.todo',
        'app.todos.list',
        'app.todos.change',
        'app.directives.datepicker',
        'app.directives.about',
        'app.directives.modal',
        'app.filters',
        'app.session',
        'app.sessionService',
        'app.user'
    ]);
})();

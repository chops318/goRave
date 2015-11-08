'use strict';

// Setting up route
angular.module('raves').config(['$stateProvider',
  function ($stateProvider) {
    // Raves state routing
    $stateProvider
      .state('raves', {
        abstract: true,
        url: '/raves',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('raves.list', {
        url: '',
        templateUrl: 'modules/articles/views/list-raves.client.view.html'
      })
      .state('raves.create', {
        url: '/create',
        templateUrl: 'modules/articles/views/create-rave.client.view.html'
      })
      .state('raves.view', {
        url: '/:raveId',
        templateUrl: 'modules/articles/views/view-rave.client.view.html'
      })
      .state('raves.edit', {
        url: '/:raveId/edit',
        templateUrl: 'modules/articles/views/edit-rave.client.view.html'
      });
  }
]);

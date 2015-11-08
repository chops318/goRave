'use strict';

//Raves service used for communicating with the raves REST endpoints
angular.module('raves').factory('Raves', ['$resource',
  function ($resource) {
    return $resource('api/raves/:raveId', {
      raveId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

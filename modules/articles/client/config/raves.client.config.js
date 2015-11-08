'use strict';

// Configuring the Raves module
angular.module('raves').run(['Menus',
  function (Menus) {
    // Add the raves dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Raves',
      state: 'raves',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'raves', {
      title: 'List Raves',
      state: 'raves.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'raves', {
      title: 'Create Raves',
      state: 'raves.create'
    });
  }
]);

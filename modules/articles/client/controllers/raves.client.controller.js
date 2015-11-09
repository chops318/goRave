'use strict';

// Raves controller
angular.module('raves').controller('RavesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Raves',
  function ($scope, $stateParams, $location, Authentication, Raves) {
    $scope.authentication = Authentication;

    // Create new Rave
    $scope.create = function () {
      // Create new Rave object
      var rave = new Raves({
        title: this.title,
        content: this.content,
        usability: this.usability,
        usabilityForm: this.usabilityForm
      });

      // Redirect after save
      rave.$save(function (response) {
        $location.path('raves/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Rave
    $scope.remove = function (rave) {
      if (rave) {
        rave.$remove();

        for (var i in $scope.raves) {
          if ($scope.raves[i] === rave) {
            $scope.raves.splice(i, 1);
          }
        }
      } else {
        $scope.rave.$remove(function () {
          $location.path('raves');
        });
      }
    };

    // Update existing Rave
    $scope.update = function () {
      var rave = $scope.rave;

      rave.$update(function () {
        $location.path('raves/' + rave._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Raves
    $scope.find = function () {
      $scope.raves = Raves.query();
    };

    // Find existing Rave
    $scope.findOne = function () {
      $scope.rave = Raves.get({
        raveId: $stateParams.raveId
      });
    };
  }
]);

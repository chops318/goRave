'use strict';

(function () {
  // Raves Controller Spec
  describe('Raves Controller Tests', function () {
    // Initialize global variables
    var RavesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Raves,
      mockRave;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Raves_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Raves = _Raves_;

      // create mock rave
      mockRave = new Raves({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Rave about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Raves controller.
      RavesController = $controller('RavesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one rave object fetched from XHR', inject(function (Raves) {
      // Create a sample raves array that includes the new rave
      var sampleRaves = [mockRave];

      // Set GET response
      $httpBackend.expectGET('api/raves').respond(sampleRaves);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.raves).toEqualData(sampleRaves);
    }));

    it('$scope.findOne() should create an array with one rave object fetched from XHR using a raveId URL parameter', inject(function (Raves) {
      // Set the URL parameter
      $stateParams.raveId = mockRave._id;

      // Set GET response
      $httpBackend.expectGET(/api\/raves\/([0-9a-fA-F]{24})$/).respond(mockRave);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.rave).toEqualData(mockRave);
    }));

    describe('$scope.craete()', function () {
      var sampleRavePostData;

      beforeEach(function () {
        // Create a sample rave object
        sampleRavePostData = new Raves({
          title: 'An Rave about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Rave about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Raves) {
        // Set POST response
        $httpBackend.expectPOST('api/raves', sampleRavePostData).respond(mockRave);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the rave was created
        expect($location.path.calls.mostRecent().args[0]).toBe('raves/' + mockRave._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/raves', sampleRavePostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock rave in scope
        scope.rave = mockRave;
      });

      it('should update a valid rave', inject(function (Raves) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/raves\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/raves/' + mockRave._id);
      }));

      it('should set scope.error to error response message', inject(function (Raves) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/raves\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(rave)', function () {
      beforeEach(function () {
        // Create new raves array and include the rave
        scope.raves = [mockRave, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/raves\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockRave);
      });

      it('should send a DELETE request with a valid raveId and remove the rave from the scope', inject(function (Raves) {
        expect(scope.raves.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.rave = mockRave;

        $httpBackend.expectDELETE(/api\/raves\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to raves', function () {
        expect($location.path).toHaveBeenCalledWith('raves');
      });
    });
  });
}());

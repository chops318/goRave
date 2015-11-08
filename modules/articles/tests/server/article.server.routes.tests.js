'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rave = mongoose.model('Rave'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, rave;

/**
 * Rave routes tests
 */
describe('Rave CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new rave
    user.save(function () {
      rave = {
        title: 'Rave Title',
        content: 'Rave Content'
      };

      done();
    });
  });

  it('should be able to save an rave if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rave
        agent.post('/api/raves')
          .send(rave)
          .expect(200)
          .end(function (raveSaveErr, raveSaveRes) {
            // Handle rave save error
            if (raveSaveErr) {
              return done(raveSaveErr);
            }

            // Get a list of raves
            agent.get('/api/raves')
              .end(function (ravesGetErr, ravesGetRes) {
                // Handle rave save error
                if (ravesGetErr) {
                  return done(ravesGetErr);
                }

                // Get raves list
                var raves = ravesGetRes.body;

                // Set assertions
                (raves[0].user._id).should.equal(userId);
                (raves[0].title).should.match('Rave Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an rave if not logged in', function (done) {
    agent.post('/api/raves')
      .send(rave)
      .expect(403)
      .end(function (raveSaveErr, raveSaveRes) {
        // Call the assertion callback
        done(raveSaveErr);
      });
  });

  it('should not be able to save an rave if no title is provided', function (done) {
    // Invalidate title field
    rave.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rave
        agent.post('/api/raves')
          .send(rave)
          .expect(400)
          .end(function (raveSaveErr, raveSaveRes) {
            // Set message assertion
            (raveSaveRes.body.message).should.match('Title cannot be blank');

            // Handle rave save error
            done(raveSaveErr);
          });
      });
  });

  it('should be able to update an rave if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rave
        agent.post('/api/raves')
          .send(rave)
          .expect(200)
          .end(function (raveSaveErr, raveSaveRes) {
            // Handle rave save error
            if (raveSaveErr) {
              return done(raveSaveErr);
            }

            // Update rave title
            rave.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing rave
            agent.put('/api/raves/' + raveSaveRes.body._id)
              .send(rave)
              .expect(200)
              .end(function (raveUpdateErr, raveUpdateRes) {
                // Handle rave update error
                if (raveUpdateErr) {
                  return done(raveUpdateErr);
                }

                // Set assertions
                (raveUpdateRes.body._id).should.equal(raveSaveRes.body._id);
                (raveUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of raves if not signed in', function (done) {
    // Create new rave model instance
    var raveObj = new Rave(rave);

    // Save the rave
    raveObj.save(function () {
      // Request raves
      request(app).get('/api/raves')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single rave if not signed in', function (done) {
    // Create new rave model instance
    var raveObj = new Rave(rave);

    // Save the rave
    raveObj.save(function () {
      request(app).get('/api/raves/' + raveObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', rave.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single rave with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/raves/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rave is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single rave which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent rave
    request(app).get('/api/raves/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No rave with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an rave if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new rave
        agent.post('/api/raves')
          .send(rave)
          .expect(200)
          .end(function (raveSaveErr, raveSaveRes) {
            // Handle rave save error
            if (raveSaveErr) {
              return done(raveSaveErr);
            }

            // Delete an existing rave
            agent.delete('/api/raves/' + raveSaveRes.body._id)
              .send(rave)
              .expect(200)
              .end(function (raveDeleteErr, raveDeleteRes) {
                // Handle rave error error
                if (raveDeleteErr) {
                  return done(raveDeleteErr);
                }

                // Set assertions
                (raveDeleteRes.body._id).should.equal(raveSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an rave if not signed in', function (done) {
    // Set rave user
    rave.user = user;

    // Create new rave model instance
    var raveObj = new Rave(rave);

    // Save the rave
    raveObj.save(function () {
      // Try deleting rave
      request(app).delete('/api/raves/' + raveObj._id)
        .expect(403)
        .end(function (raveDeleteErr, raveDeleteRes) {
          // Set message assertion
          (raveDeleteRes.body.message).should.match('User is not authorized');

          // Handle rave error error
          done(raveDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Rave.remove().exec(done);
    });
  });
});

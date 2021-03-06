var fs = require('fs'),
      should = require('chai').should(),
      supertest = require('supertest'),
      api = supertest('http://localhost:3001');

// Get admin user created on intial setup for API key to use with tests
var admin_user = JSON.parse(fs.readFileSync(process.cwd() + '/config.json')).default_admin;

// DB table list test
describe('GET /dbtest', function() {
  it('lists all db tables', function (done) {
    api.get('/dbtest')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      res.body.should.have.deep.property('meta.success').and.equal(true);
      res.body.should.have.property('tables').and.be.an.instanceof(Array).and.not.be.empty;
      done();
    });
  });
});

// User authentication tests
describe('POST /authenticate', function() {
  it('username and password match and exist', function (done) {
    api.post('/authenticate')
    .send({ username: admin_user.username, password: admin_user.password })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      admin_user.key = (res.body.user.key.id) ? res.body.user.key.id : null;
      res.body.should.have.deep.property('meta.success').and.equal(true);
      res.body.should.have.deep.property('user').and.be.an.instanceof(Object).and.not.be.empty;
      res.body.should.have.deep.property('user.id');
      res.body.should.have.deep.property('user.role').and.equal(1);
      res.body.should.have.deep.property('user.key.id');
      res.body.should.have.deep.property('user.key.createdAt');
      res.body.should.have.deep.property('user.key.updatedAt');
      done();
    });
  });

  it('email and password match and exist', function (done) {
    api.post('/authenticate')
    .send({ username: admin_user.email, password: admin_user.password })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      admin_user.key = (res.body.user.key.id) ? res.body.user.key.id : null;
      res.body.should.have.deep.property('meta.success').and.equal(true);
      res.body.should.have.deep.property('user').and.be.an.instanceof(Object).and.not.be.empty;
      res.body.should.have.deep.property('user.id');
      res.body.should.have.deep.property('user.role').and.equal(1);
      res.body.should.have.deep.property('user.key.id');
      res.body.should.have.deep.property('user.key.createdAt');
      res.body.should.have.deep.property('user.key.updatedAt');
      done();
    });
  });

  it('error 401 when username and password do not match', function (done) {
    api.post('/authenticate')
    .send({ username: admin_user.username, password: 'badpassword' })
    .expect(401, done);
  });

  it('error 401 when username and password do not exist', function (done) {
    api.post('/authenticate')
    .send({ username: 'nouser', password: 'nouser' })
    .expect(401, done);
  });
});

// Data creation tests
describe('POST /:path', function() {
  // User creation
  describe('users', function() {
    var user = {
      username: 'test',
      password: 'test',
      firstName: 'test',
      lastName: 'test',
      email: 'test@no-reply.com',
      RoleId: 3
    };

    it('creates user with salted and hashed password in db', function (done) {
      api.post('/users')
      .set('x-api-key', admin_user.key)
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.deep.property('users').and.be.an.instanceof(Object).and.not.be.empty;
        res.body.should.have.deep.property('users.username').and.equal('test');
        res.body.should.have.deep.property('users.firstName').and.equal('test');
        res.body.should.have.deep.property('users.lastName').and.equal('test');
        res.body.should.have.deep.property('users.email').and.equal('test@no-reply.com');
        res.body.should.have.deep.property('users.RoleId').and.equal(3);
        done();
      });
    });

    it('error 500 when username or email already exists', function (done) {
      api.post('/users')
      .set('x-api-key', admin_user.key)
      .send(user)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 500 when password is not provided', function (done) {
      user.username = 'tester';
      user.password = null;
      user.email = 'tester@no-reply.com';
      api.post('/users')
      .set('x-api-key', admin_user.key)
      .send(user)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 500 when attribute values are invalid', function (done) {
      user.username = null;
      user.password = 'test';
      user.email = null;
      api.post('/users')
      .set('x-api-key', admin_user.key)
      .send(user)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 401 unauthorized when using incorrect key', function(done) {
      user.username = 'tester';
      user.password = 'test';
      user.email = 'tester@no-reply.com';
      api.post('/users')
      .set('x-api-key', 'badkey')
      .send(user)
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 403 forbidden when user role does not allow creation', function(done) {
      user.username = 'test';
      user.password = 'test';
      api.post('/authenticate')
      .send({ username: user.username, password: user.password })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        user.username = 'testing';
        user.email = 'testing@testing.com';
        api.post('/users')
        .set('x-api-key', res.body.user.key.id)
        .send(user)
        .expect(403)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.deep.property('meta.success').and.equal(false);
          done();
        });
      });
    });
  });
});

// Data update tests
describe('PUT /:path/:id', function() {
  // User update
  describe('users', function() {
    var user = {
      username: 'tester',
      password: 'tester',
      firstName: 'tester',
      lastName: 'tester',
      email: 'tester@no-reply.com'
    };

    it('updates currently authorized user', function (done) {
      admin_user.id = 1;
      admin_user.firstName = "Test First Name";
      admin_user.lastName = "Test Last Name";
      admin_user.password = null;
      admin_user.RoleId = 1;

      api.put('/users/1')
      .set('x-api-key', admin_user.key)
      .send(admin_user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.deep.property('users').and.not.be.empty;
        res.body.should.have.deep.property('users.id').and.not.be.empty;
        res.body.should.have.deep.property('users.firstName').and.equal('Test First Name');
        res.body.should.have.deep.property('users.lastName').and.equal('Test Last Name');
        res.body.should.have.deep.property('users.RoleId').and.equal(1);
        done();
      });
    });

    it('updates another user when role allows updating other users', function (done) {
      api.get('/users?username=test')
      .set('x-api-key', admin_user.key)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        user.id = res.body.users.id;
        api.put('/users/' + user.id)
        .set('x-api-key', admin_user.key)
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.deep.property('meta.success').and.equal(true);
          res.body.should.have.deep.property('users').and.not.be.empty;
          done();
        });
      });
    });

    it('error 500 when user does not exist to update', function (done) {
      api.put('/users/0')
      .set('x-api-key', admin_user.key)
      .send(user)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 500 when attribute values are invalid', function (done) {
      user.email = null;
      api.put('/users/' + user.id)
      .set('x-api-key', admin_user.key)
      .send(user)
      // .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 401 unauthorized when using incorrect key', function(done) {
      api.put('/users/' + admin_user.id)
      .set('x-api-key', 'badkey')
      .send(user)
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 403 forbidden when user role does not allow updates to other users', function(done) {
      api.post('/authenticate')
      .send({ username: 'tester', password: 'tester' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        user.username = 'testing';
        user.email = 'testing@testing.com';
        api.put('/users/1')
        .set('x-api-key', res.body.user.key.id)
        .send(user)
        .expect(403)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.deep.property('meta.success').and.equal(false);
          done();
        });
      });
    });
  });
});

// Data list test
describe('GET /:path', function() {
  // User list
  describe('users', function() {
    it('lists all users', function (done) {
      api.get('/users')
      .set('x-api-key', admin_user.key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.property('users').and.be.an.instanceof(Array).and.not.be.empty;
        done();
      });
    });

    it('lists single user with query parameters', function(done) {
      api.get('/users?username=' + admin_user.username)
      .set('x-api-key', admin_user.key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.property('users').and.not.be.empty;
        done();
      });
    });

    it('lists single user with id', function(done) {
      api.get('/users/1')
      .set('x-api-key', admin_user.key)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(true);
        res.body.should.have.property('users').and.be.an.instanceof(Object).and.not.be.empty;
        done();
      });
    });

    it('list currently authorized user details', function (done) {
      api.post('/authenticate')
      .send({ username: 'tester', password: 'tester' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        api.get('/users/'+res.body.user.id)
        .set('x-api-key', res.body.user.key.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.deep.property('meta.success').and.equal(true);
          res.body.should.have.property('users').and.be.an.instanceof(Object).and.not.be.empty;
          done();
        });
      });
    });

    it('error 401 unauthorized when using incorrect key', function(done) {
      api.get('/users')
      .set('x-api-key', 'badkey')
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 403 forbidden when non-admin tries to view users', function (done) {
      api.post('/authenticate')
      .send({ username: 'tester', password: 'tester' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        api.get('/users')
        .set('x-api-key', res.body.user.key.id)
        .expect(403)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.have.deep.property('meta.success').and.equal(false);
          done();
        });
      });
    });
  });

  describe('keys', function() {
    it('error 403 forbidden when trying to access protected data', function (done) {
      api.get('/keys')
      .set('x-api-key', admin_user.key)
      .expect(403)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
});

// Data delete tests
describe('DELETE /:path/:id', function() {
  // User delete
  describe('users', function() {
    var user = {
      id: null
    };

    it('removes user with given id', function (done) {
      api.get('/users?username=tester')
      .set('x-api-key', admin_user.key)
      .end(function (err, res) {
        user.id = res.body.users.id;
        api.del('/users/'+user.id)
        .set('x-api-key', admin_user.key)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.deep.property('meta.success').and.equal(true);
          done();
        });
      });
    });

    it('error 500 when user does not exist to delete', function (done) {
      user.id = 0;
      api.del('/users/'+user.id)
      .set('x-api-key', admin_user.key)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 401 unauthorized when using incorrect key', function(done) {
      api.del('/users/1')
      .set('x-api-key', 'badkey')
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });

    it('error 403 forbidden when trying to delete currently authorized user', function(done) {
      api.del('/users/1')
      .set('x-api-key', admin_user.key)
      .expect(403)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.deep.property('meta.success').and.equal(false);
        done();
      });
    });
  });
});

/* API methods
------------*/

var _ = require('lodash'),
      data = require('./data'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

module.exports = function(app) {

  /* Passport strategies and methods
  ----------------------------------*/

  // verify user
  passport.use(new LocalStrategy(
    function (username, password, done) {
      // check if valid user
      data.authenticateUser({
        username: username,
        password: password
      },
      // return user or error
      function (err, results) {
        if (!err) { return done(null, results); }
        else { return done(err); }
      });
    })
  );

  // verify api key
  passport.use(new LocalAPIKeyStrategy({ apiKeyHeader: 'x-api-key' },
    function (apikey, done) {
      // check if valid api key
      data.authenticateKey( apikey,
      function (err, results) {
        if (!err) { return done(null, results); }
        else { throw err; }
      });
    })
  );

  /* Helper methods for authorization and responses
  -----------------------------------------*/

  // constants for authorization levels
  var ADMIN_ONLY = ['users'];
  var ALLOWED = [];
  var ADMIN = 1;
  var WRITE = 2;
  var READ = 3;

  // route authorization
  function requireRole(role, req, key) {
    // seperate authorization for modifying users
    if (req.params.path == 'users') {
      switch (req.method) {
        case 'POST': {
          // check to insure admin getting or creating users
          if (key.user.RoleId == ADMIN) { return true; }
          else { return false; }
        }
        break;
        case 'GET':
        case 'PUT': {
          // check to insure self or admin to view or update user
          if (key.user.id == req.params.id || key.user.RoleId == ADMIN) { return true; }
          else { return false; }
        }
        break;
        case 'DELETE': {
          // check to insure admin and not deleting self
          if (key.user.id != req.params.id && key.user.RoleId == ADMIN) { return true; }
          else { return false; }
        }
        break;
      }
    } else {
      // check for admin only path and admin user
      if (_.contains(ADMIN_ONLY, req.params.path) && key.user.RoleId == ADMIN) {
        return true;
      // check for valid permissions to access
      } else if (!_.contains(ADMIN_ONLY, req.params.path) && _.contains(ALLOWED, req.params.path) && key.user.RoleId <= role) {
        return true;
      // otherwise not allowed access
      } else {
        return false;
      }
    }
  }

  // generate error or invalid auth responses
  function invalidAuth(err, res) {
    if (err) { response(res, 500, false, err, null); }
    else { response(res, 401, false, 'Not Authorized', null); }
  }

 // creates and sends api response
  function response(res, code, success, message, data, total) {
    var meta = {
      "meta": {
        "success": success,
        "message": message,
        "total": null,
        "page": null
      }
    };
    res.json(code, _.extend(meta, data));
  }

  /* Routes
  ---------*/

  // list db tables
  // returns metadata with list of tables
  // FOR INITIAL SETUP/TESTING ONLY FOR NOW
  app.get('/dbtest', function (req, res) {
    data.tableList(function (err, results) {
      if (!err) { response(res, 200, true, 'Tables', results); }
      else { response(res, 500, false, err, null); }
    });
  });

  // verify username and password
  // returns status and object with user info and key
  app.post('/authenticate', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { invalidAuth(err, res); }
      else if (!user) { invalidAuth(null, res); }
      else if (user) { response(res, 200, true, 'Authorized', { "user": user }); }
    })(req, res, next);
  });

  // search
  // returns array list of items
  app.get('/:path', function(req, res, next) {
    passport.authenticate('localapikey', function(err, key, info) {
      if (err) { invalidAuth(err, res); }
      else if (!key) { invalidAuth(null, res); }
      else if (key && requireRole(READ, req, key)) {
        // parse query string into object
        var query = require('url').parse(req.url,true).query;
        // determine if query string exists
        query = (_.isEmpty(query)) ? null : query;
        // search for all data or data limited by where conditions in query string
        data.searchData(req.params.path, null, query, function (err, results) {
          if (err) { response(res, 500, false, err, null); }
          else if (!results) { response(res, 404, false, err, null); }
          else if (results) { response(res, 200, true, 'Data found', results); }
        });
      } else { response(res, 403, false, 'Not Authorized', null); }
    })(req, res, next);
  });

  // search by id
  // returns status with item data
  app.get('/:path/:id', function (req, res, next) {
    passport.authenticate('localapikey', function(err, key, info) {
      if (err) { invalidAuth(err, res); }
      else if (!key) { invalidAuth(null, res); }
      else if (key && requireRole(READ, req, key)) {
        // search for data matching given id
        data.searchData(req.params.path, req.params.id, null, function (err, results) {
          if (err) { response(res, 500, false, err, null); }
          else if (!results) { response(res, 404, false, err, null); }
          else if (results) { response(res, 200, true, 'Data found', results); }
        });
      } else { response(res, 403, false, 'Not Authorized', null); }
    })(req, res, next);
  });

  // create
  // returns status with data
  app.post('/:path', function (req, res, next) {
    passport.authenticate('localapikey', function(err, key, info) {
      if (err) { invalidAuth(err, res); }
      else if (!key) { invalidAuth(null, res); }
      else if (key && requireRole(WRITE, req, key)) {
        // create data and respond with data or error
        data.createData(req.params.path, req.body, function (err, results) {
          if (err) { response(res, 500, false, err, null); }
          else if (!results) { response(res, 404, false, err, null); }
          else if (results) { response(res, 200, true, 'Data created', results); }
        });
      } else { response(res, 403, false, 'Not Authorized', null); }
    })(req, res, next);
  });

  // update
  // returns status with no data
  app.put('/:path/:id', function (req, res, next) {
    passport.authenticate('localapikey', function(err, key, info) {
      if (err) { invalidAuth(err, res); }
      else if (!key) { invalidAuth(null, res); }
      else if (key && requireRole(WRITE, req, key)) {
        // search for data to update matching given id
        data.updateData(req.params.path, req.params.id, req.body, function (err, results) {
          if (err) { response(res, 500, false, err, null); }
          else if (!results) { response(res, 404, false, err, null); }
          else if (results) { response(res, 200, true, 'Data updated', results); }
        });
      } else { response(res, 403, false, 'Not Authorized', null); }
    })(req, res, next);
  });

  // delete
  // returns status with no data
  app.delete('/:path/:id', function (req, res, next) {
    passport.authenticate('localapikey', function(err, key, info) {
      if (err) { invalidAuth(err, res); }
      else if (!key) { invalidAuth(null, res); }
      else if (key && requireRole(WRITE, req, key)) {
        // search for data to delete matching given id
        data.deleteData(req.params.path, req.params.id, function (err, results) {
          if (err) { response(res, 500, false, err, null); }
          else if (!results) { response(res, 404, false, err, null); }
          else if (results) { response(res, 200, true, 'Data deleted', results); }
        });
      } else { response(res, 403, false, 'Not Authorized', null); }
    })(req, res, next);
  });
};

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
        if (!err)
          return done(null, results);
        else
          return done(err);
      });
    })
  );

  // verify api key
  passport.use(new LocalAPIKeyStrategy({ apiKeyHeader: 'x-api-key' },
    function (apikey, done) {
      // check if valid api key
      data.authenticateKey(
      apikey,
      function (err, results) {
        if (!err)
          return done(null, results);
        else
          throw err;
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
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

  // response for unauthorized users
  // returns status with no data
  app.get('/unauthorized', function (req, res) {
    response(res, 401, false, 'Not Authorized', null);
  });

  // list db tables
  // returns metadata with list of tables
  app.get('/dbtest', function (req, res) {
    data.tableList(function (err, results) {
      if (!err)
        response(res, 200, true, 'Tables', results);
      else
        response(res, 500, false, err, null);
    });
  });

  // verify username and password
  // returns status and object with user info and key
  app.post('/authenticate',
    passport.authenticate('local', {
      session: false,
      failureRedirect: 'unauthorized'
    }),
    function (req, res) {
      response(res, 200, true, 'Authorized', { "user": req.user });
    }
  );

  // search
  // returns array list of items
  app.get('/:path',
    passport.authenticate('localapikey', {
      session: false,
      failureRedirect: 'unauthorized'
    }),
    function (req, res) {
      // parse query string into object
      var query = require('url').parse(req.url,true).query;
      // determine if query string exists
      query = (_.isEmpty(query)) ? null : query;
      // search for all data or data limited by where conditions in query string
      data.searchData(req.params.path, null, query, function (err, results) {
        if (!err)
          response(res, 200, true, 'Data found', results);
        else
          response(res, 500, false, err, null);
      });
    }
  );

  // search by id
  // returns status with item data
  app.get('/:path/:id',
    passport.authenticate('localapikey', {
      session: false,
      failureRedirect: 'unauthorized'
    }),
    function (req, res) {
      // search for data matching given id
      data.searchData(req.params.path, req.params.id, null, function (err, results) {
        if (!err)
          response(res, 200, true, 'Data found', results);
        else
          response(res, 500, false, err, null);
      });
    }
  );

  // create
  // returns status with data
  app.post('/:path',
    passport.authenticate('localapikey', {
      session: false,
      failureRedirect: 'unauthorized'
    }),
    function (req, res) {
      // create data and respond with data or error
      data.createData(req.params.path, req.body, function (err, results) {
        if (!err)
          response(res, 200, true, 'Data created', results);
        else
          response(res, 500, false, err, null);
      });
    }
  );

  // update
  // returns status with no data
  app.put('/:path/:id',
    passport.authenticate('localapikey', {
      session: false,
      failureRedirect: 'unauthorized'
    }),
    function (req, res) {
      // search for data to update matching given id
      data.updateData(req.params.path, req.params.id, req.body, function (err, results) {
        if (!err)
          response(res, 200, true, 'Data updated', results);
        else
          response(res, 500, false, err, null);
      });
    }
  );

  // delete
  // returns status with no data
  app.delete('/:path/:id',
    passport.authenticate('localapikey', {
      session: false,
      failureRedirect: 'unauthorized'
    }),
    function (req, res) {
      // search for data to delete matching given id
      data.deleteData(req.params.path, req.params.id, function (err, results) {
        if (!err)
          response(res, 200, true, 'Data deleted', results);
        else
          response(res, 500, false, err, null);
      });
    }
  );
};
// require modules
var http = require('http'),
  cors = require('cors'),
  express = require('express'),
  passport = require('passport'),
  fs = require('fs');

// create app
var app = express();

// configure app
app.configure(function () {
  app
  .use(express.methodOverride())
  .use(express.bodyParser())
  .use(passport.initialize())
  .use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
  }))
  .use(app.router)
  // serve static website in public folder
  .use(express.static( __dirname + '/public'))
  // handle 404 not found
  .use(function (req, res, next) {
    res.status(404).send('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  })
  .use(function (err, req, res, next){
    console.error(err.stack);
    res.json(500, 'Internal Error');
  });
});

// process command line flags
process.argv.forEach(function(val, index, array) {
  var data = require('./app/data');
  if (val === '-init') {
    // run initial db setup
    data.intialSetup(function(err, results) {
      if (err) throw err;
      console.log('Initial setup complete');
    });
  } else if (val === '-admin') {
    // create (or recreate) default admin user
    data.adminReset(function(err, results) {
      if (err) throw err;
      console.log('Default admin user created');
    });
  }
});

// require api routes and functions
var api = require('./app/api');
// send app to api to handle incoming requests
api(app);

// start server
app.listen(8001, '127.0.0.1');
console.log('Listening on http://localhost:3001');
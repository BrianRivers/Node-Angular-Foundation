/* User authenticaion and creation methods
------------------------------------------*/

var db = require('./db'),
  uuid = require('node-uuid'),
  bcrypt = require('bcrypt'),
  moment = require('moment');

function verifyPath(path) {
  // get path aka table or model to search for
  path = db.Sequelize.Utils._.capitalize(path);

  if (db.Sequelize.Utils._.contains(db.tableNames, path)) return path;
  else return null;
}

// runs inital db setup and creates default admin user
exports.intialSetup = function intialSetup(callback) {
  db.sequelize
  .sync({
    force: true,
    logging: false
  })
  .complete(function (err) {
    if (err) throw err;
    else {
      var admin_user = {
        username: 'admin',
        password: 'giscenter',
        firstName: null,
        lastName: null,
        email: 'apgiscenter@gmail.com'
      };
      exports.createUser(admin_user, callback);
    }
  });
};

exports.tableList = function tableList(callback) {
  // sql query using sequelize
  db.sequelize.query('SHOW TABLES FROM dev_db')
  .success(function (rows) {
    callback(null, { "tables": rows });
  })
  .error(function (err) {
    response(res, 500, false, err, null);
  });
};

// verifies a users credentials
exports.authenticateUser = function authenticateUser(user, callback) {
  // search for user
  db.Users.find({
    where: { username: user.username },
    include: [db.Keys]
  })
  .success(function (result) {
    // if user is found
    if (result) {
      // check password hash against provided password
      if (bcrypt.compareSync(user.password, result.password)) {
        var key = result.key;
        delete result.key;
        callback(null, db.Sequelize.Utils._.merge(result, key));
      } else {
        callback(null, false);
      }
    } else {
      callback(null, false);
    }
  })
  .error(function (err) {
    callback(err, false);
  });
};

// verifies key exists
exports.authenticateKey = function authenticateKey(apikey, callback) {
  // search for key
  db.Keys.find({ where: { key: apikey } })
  .success(function (result) {
    // if key is found
    if (result)
      callback(null, true);
    else
      callback(null, false);
  })
  .error(function (err) {
    callback(err, false);
  });
};

exports.listData = function listData(path, query, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    // find all users and return list or error
    db[model].findAll()
    .success(function (result) {
      var values = {};
      values[model.toLowerCase()] = result;
      if (result)
        callback(null, values);
      else
        callback(null, false);
    })
    .error(function (err) {
      callback(err, false);
    });
  }
  else callback('Invalid search', false);
};

// creates user and api key, returns this data
exports.createUser = function createUser(newUser, callback) {
  // hash new password
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  // create user
  db.Users
  .create(newUser)
  .success(function (user, created) {
    // create api key for user
    var newKey = uuid.v1();
    db.Keys
    .create({key: newKey})
    .success(function (key, created) {
      // associate user with key
      user.setKey(key)
      .success(function (){
        callback(null, {
          "user": db.Sequelize.Utils._.merge(user.values,key.values)
        });
      })
      .error(function (err) {
        callback(err, false);
      });
    })
    .error(function (err) {
      callback(err, false);
    });
  })
  .error(function (err) {
    callback(err, false);
  });
};

// updates user with given attributes
exports.updateUser = function updateUser(existingUser, callback) {
  // hash updated password
  existingUser.password = bcrypt.hashSync(existingUser.password, 10);
  // find exsiting user matching id
  db.Users.find({ where: { id: existingUser.id } })
  .success(function (user) {
    if (user) {
      // update user and respond with result or error
      delete existingUser.id;
      user.updateAttributes(existingUser)
      .success(function () {
        callback(null, true);
      })
      .error(function (err) {
        callback(err, false);
      });
    } else {
      callback('user not found or unable to update', false);
    }
  })
  .error(function (err) {
    callback(err, false);
  });
};

// delete user matching given id
exports.deleteUser = function deleteUser(existingUser, callback) {
  // find existing user matching id
  db.Users.find({ where: { id: existingUser.id } })
  .success(function (user) {
    if (user) {
      // remove user and respond with result or error
      user.destroy()
      .success( function () {
        callback(null, true);
      })
      .error(function (err) {
        callback(err, false);
      });
    } else {
      callback('user not found or unable to delete', false);
    }
  })
  .error(function (err) {
    callback(err, false);
  });
};
/* User authenticaion and creation methods
------------------------------------------*/

var db = require('./db'),
  uuid = require('node-uuid'),
  bcrypt = require('bcrypt'),
  moment = require('moment');

// verifies model exists in db
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
      exports.createData('Users', admin_user, callback);
    }
  });
};

// lists all tables in db
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

exports.listItem = function listItem(path, id, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    // find all users and return list or error
    db[model].find(id)
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

exports.listItems = function listItems(path, query, callback) {
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

// creates data, returns this data
exports.createData = function createData(path, data, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    // hash new password
    if (model === 'Users') {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    // create user
    db[model]
    .create(data)
    .success(function (result, created) {
      if (model === 'Users') {
        // create api key for user
        var newKey = uuid.v1();
        db.Keys
        .create({key: newKey})
        .success(function (key, created) {
          // associate user with key
          result.setKey(key)
          .success(function (){
            callback(null, {
              "user": db.Sequelize.Utils._.merge(result.values,key.values)
            });
          })
          .error(function (err) {
            callback(err, false);
          });
        })
        .error(function (err) {
          callback(err, false);
        });
      } else {
        var values = {};
        values[path] = result.values;
        callback(null, values);
      }
    })
    .error(function (err) {
      callback(err, false);
    });
  } else {
    callback('Invalid creation', false);
  }
};

// updates data with given attributes
exports.updateData = function updateData(path, id, data, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    // hash updated password
    if (model === 'Users') {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    // find exsiting data matching id
    db[model].find({ where: { id: id } })
    .success(function (result) {
      if (result) {
        // update data and respond with result or error
        delete data.id;
        result.updateAttributes(data)
        .success(function () {
          callback(null, true);
        })
        .error(function (err) {
          callback(err, false);
        });
      } else {
        callback('Data not found or unable to update', false);
      }
    })
    .error(function (err) {
      callback(err, false);
    });
  }
  else callback('Invalid update', false);
};

// delete data matching given id
exports.deleteData = function deleteData(path, id, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    // find existing data matching id
    db[model].find({ where: { id: id } })
    .success(function (result) {
      if (result) {
        // remove user and respond with result or error
        result.destroy()
        .success( function () {
          callback(null, true);
        })
        .error(function (err) {
          callback(err, false);
        });
      } else {
        callback('Data not found or unable to delete', false);
      }
    })
    .error(function (err) {
      callback(err, false);
    });
  } else {
    callback('Invalid deletion', false);
  }
};
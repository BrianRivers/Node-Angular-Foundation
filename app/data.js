/* User authenticaion and creation methods
------------------------------------------*/

var db = require('./db'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  bcrypt = require('bcrypt'),
  moment = require('moment');

// verifies model exists in db and is allowed to be accessed
function verifyPath(path) {
  var ALLOWED = ['Users'];
  // get path aka table or model to search for
  path = db.Sequelize.Utils._.capitalize(path);

  if (db.Sequelize.Utils._.contains(db.tableNames, path) &&
    db.Sequelize.Utils._.contains(ALLOWED, path)) {
    return path;
  } else { return null; }
}

// runs inital db setup and creates default admin user
exports.intialSetup = function intialSetup(callback) {
  db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
  .success(function() {
    db.sequelize
    .sync({
      force: true,
      language: 'en',
      logging: true
    })
    .complete(function (err) {
      if (err) throw err;
      else {
        db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        var admin_user = JSON.parse(fs.readFileSync(process.cwd() + '/config.json')).default_admin;
        var roles = JSON.parse(fs.readFileSync(process.cwd() + '/config.json')).roles;
        db.Roles.bulkCreate(roles)
        .success(function() {
           exports.createData('Users', admin_user, callback);
        })
        .error(function(err) {
          callback(err, false);
        });
      }
    });
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
        // generate new key for user on valid authentication
        db.Keys.find(result.key.id)
        .success(function(currentKey) {
          currentKey.key =  uuid.v1();
          currentKey.save()
          .success(function() {
            // return user information
            var authUser = {
              "id": result.id,
              "role": result.RoleId,
              "key": {
                "id": currentKey.key,
                "createdAt": currentKey.createdAt,
                "updatedAt": currentKey.updatedAt
              }
            };
            callback(null, authUser);
          })
          .error(function(err) {
            callback(err, false);
          });
        })
        .error(function(err) {
          callback(err, false);
        });
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
  db.Keys.find({
    where: { key: apikey },
    include: [db.Users]
  })
  .success(function (result) {
    // if key is found
    if (result) {
      // check if key is older than 12 hours for needing to log in again
      var now = moment();
      var keyTime = moment(result.updatedAt);
      if (now.diff(keyTime, 'hours') < 12) {
        callback(null, result.values);
      } else {
        callback(null, false);
      }
    }
    else
      callback(null, false);
  })
  .error(function (err) {
    callback(err, false);
  });
};

exports.searchData = function searchData(path, id, query, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    if (id) {
      // find model data by id
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
    } else if (query) {
      // find model data by where conditions
      db[model].find({ where: query })
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
    } else {
      // find all data for model
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
  }
  else callback(null, false);
};

// creates data, returns this data
exports.createData = function createData(path, data, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    if (model === 'Users') {
      // hash new password
      data.password = bcrypt.hashSync(data.password, 10);
    }
    // create data
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
            // return newly created user and key
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
        // return newly created data
        var values = {};
        values[path] = result.values;
        callback(null, values);
      }
    })
    .error(function (err) {
      callback(err, false);
    });
  } else {
    callback(null, false);
  }
};

// updates data with given attributes
exports.updateData = function updateData(path, id, data, callback) {
  // determine model availability
  var model = verifyPath(path);
  if (model) {
    if (model === 'Users') {
      // hash updated password
      if (data.hasOwnProperty('password') && data.password !== null) {
        data.password = bcrypt.hashSync(data.password, 10);
      }
    }
    // find exsiting data matching id
    db[model].find({ where: { id: id } })
    .success(function (result) {
      if (result) {
        // update data and respond with result or error
        delete data.id;
        result.updateAttributes(data)
        .success(function () {
          // respond with updated record
          db[model].find(id)
          .success(function (result) {
            var values = {};
            values[model.toLowerCase()] = result.values;
            callback(null, values);
          })
          .error(function (err) {
            callback(err, false);
          });
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
  else callback(null, false);
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
    callback(null, false);
  }
};
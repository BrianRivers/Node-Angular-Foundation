/* User authenticaion and creation methods
------------------------------------------*/

var db = require('./db'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  bcrypt = require('bcrypt'),
  moment = require('moment');

// verifies model exists in db and is allowed to be accessed
function verifyPath(path) {
  // get path aka table or model to search for
  path = db.Sequelize.Utils._.capitalize(path);

  if (db.Sequelize.Utils._.contains(db.tableNames, path)) {
    return path;
  } else { return null; }
}

// runs inital db setup and creates default admin user
exports.intialSetup = function intialSetup(callback) {
  db.sequelize
  .sync({
    force: true,
    language: 'en',
    logging: true
  })
  .complete(function (err) {
    if (err) throw err;
    else {
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
};

exports.adminReset = function adminReset(callback) {
  var admin_user = JSON.parse(fs.readFileSync(process.cwd() + '/config.json')).default_admin;
  db['Users'].find({ where: { username: admin_user.username } })
  .success(function(result) {
    if (result) {
      exports.deleteData('Users', result.values.id, function() {
        exports.createData('Users', admin_user, callback);
      });
    } else {
      exports.createData('Users', admin_user, callback);
    }
  })
  .error(function(err) {
    callback(err, false);
  });
};

// lists all tables in db
exports.tableList = function tableList(callback) {
  // sql query using sequelize
  db.sequelize.query('SELECT table_schema,table_name FROM information_schema.tables ORDER BY table_schema,table_name;')
  .success(function (rows) {
    callback(null, { "tables": rows });
  })
  .error(function (err) {
    callback(err, false);
  });
};

// verifies a users credentials
exports.authenticateUser = function authenticateUser(user, callback) {
  db.sequelize.query('SELECT * FROM "Users" WHERE username = ? OR email = ?;', null, { plain: true, raw: true }, [user.username, user.username])
  .success(function (result) {
    // if user is found
    if (result) {
      // check password hash against provided password
      if (bcrypt.compareSync(user.password, result.password)) {
        // generate new key for user on valid authentication
        db.Keys.find({ where: { UsersId: result.id }})
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
    where: { key: apikey }
    // include: [db.Users]
  })
  .success(function (result) {
    // if key is found
    if (result) {
      // check if key is older than 12 hours for needing to log in again
      var now = moment();
      var keyTime = moment(result.updatedAt);
      if (now.diff(keyTime, 'hours') < 12) {
        db.Users.find({
          where: { id: result.values.UsersId }
        })
        .success(function (user) {
          var values = result.values;
          values.user = user.values;
          callback(null, values);
        })
        .error(function (err) {
          callback(err, false);
        });
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
        if (model === 'Users') {
          values[model.toLowerCase()].dataValues.password = null;
        }
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
        if (model === 'Users') {
          if (result instanceof Array) {
            for (var i = 0; i < values[model.toLowerCase()].length; i++) {
              values[model.toLowerCase()][i].dataValues.password = null;
            }
          } else {
            values[model.toLowerCase()].dataValues.password = null;
          }
        }
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
        if (model === 'Users') {
          for (var i = 0; i < values[model.toLowerCase()].length; i++) {
            values[model.toLowerCase()][i].dataValues.password = null;
          }
        }
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
      if (data.hasOwnProperty('password') && data.password !== null) {
        data.password = bcrypt.hashSync(data.password, 10);
      } else if (data.hasOwnProperty('password') && data.password === null) {
        callback("No password provided for user", false);
      }
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
            // return newly created user
            result.values.password = null;
            callback(null, {
              "users": result.values
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
      } else if (data.hasOwnProperty('password') && data.password === null) {
        delete data.password;
      }
    }
    // find exsiting data matching id
    db[model].find({ where: { id: id } })
    .success(function (result) {
      if (result) {
        // remove id
        if (data.hasOwnProperty('id')) {
          delete data.id;
        }
        // update data and respond with result or error
        result.updateAttributes(data)
        .success(function () {
          // respond with updated record
          db[model].find(id)
          .success(function (result) {
            var values = {};
            if (model === 'Users') {
              result.values.password = null;
            }
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

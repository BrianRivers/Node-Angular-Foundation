/* Sequelize setup
------------------*/
var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	Sequelize = require('sequelize'),
	sequelize = new Sequelize('dev_db', 'dev_db', 'dev_db', {
		host: '127.0.0.1',
		dialect: 'postgres',
		port: 5432,
		logging: false
	}),
	db = {};

var tableNames = [];

// import all data models into sequelize
fs.readdirSync(__dirname+'/models').filter(function(file) {
	return (file.indexOf('.') !== 0);
})
.forEach(function(file) {
	var model = sequelize.import(path.join(__dirname+'/models', file));
	db[model.name] = model;
	tableNames.push(model.tableName);
});

// set up relationships
Object.keys(db).forEach(function(modelName) {
	if (db[modelName].options.hasOwnProperty('associate')) {
		db[modelName].options.associate(db);
	}
});

// export db
module.exports = _.extend({
	sequelize: sequelize,
	Sequelize: Sequelize,
	tableNames: tableNames
}, db);

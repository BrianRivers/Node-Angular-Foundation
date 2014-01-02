/* Sequelize setup
------------------*/
var fs = require('fs'),
	path = require('path'),
	lodash = require('lodash'),
	Sequelize = require('sequelize'),
	sequelize = new Sequelize('dev_db', 'dev_db', 'giscenter', {
		host: '10.0.2.15',
		dialect: 'mysql',
		logging: true
	}),
	db = {};

// import all data models into sequelize
fs.readdirSync(__dirname+'/models').filter(function(file) {
	return (file.indexOf('.') !== 0);
})
.forEach(function(file) {
	var model = sequelize.import(path.join(__dirname+'/models', file));
	db[model.name] = model;
});

// set up relationships
Object.keys(db).forEach(function(modelName) {
	if (db[modelName].options.hasOwnProperty('associate')) {
		db[modelName].options.associate(db);
	}
});

// export db
module.exports = lodash.extend({
	sequelize: sequelize,
	Sequelize: Sequelize
}, db);
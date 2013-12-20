module.exports = function(sequelize, Sequelize) {
	var User = sequelize.define('User', {
		username: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING(75),
			allowNull: false
		},
		first_name: Sequelize.STRING(50),
		last_name: Sequelize.STRING(50),
		email: {
			type: Sequelize.STRING(75),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		}
	}, {
		associate: function (models) {
			User.hasOne(models.Key);
		}
	});
	return User;
};
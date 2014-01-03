/* User model
-------------*/
module.exports = function(sequelize, Sequelize) {
	var User = sequelize.define('Users', {
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true
		},
		password: {
			type: Sequelize.STRING(75),
			allowNull: false
		},
		firstName: Sequelize.STRING(50),
		lastName: Sequelize.STRING(50),
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
			User.hasOne(models.Keys, { onDelete: 'cascade' });
		}
	});
	return User;
};
module.exports = function(sequelize, Sequelize) {
	var Key = sequelize.define('Key', {
		key: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true
		}
	},{
		associate: function(models) {
			Key.belongsTo(models.User);
		}
	});
	return Key;
};
/* Key model
------------*/
module.exports = function(sequelize, Sequelize) {
	var Key = sequelize.define('Key', {
		id: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
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
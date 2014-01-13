/* Role model
------------*/
module.exports = function(sequelize, Sequelize) {
  var Role = sequelize.define('Roles', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    }
  },{
    associate: function(models) {
      Role.hasMany(models.Users, {
        onUpdate: "cascade",
        onDelete: "cascade"
      });
    }
  });
  return Role;
};
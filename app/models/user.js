/* User model
-------------*/
module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define('Users', {
    id: {
      type: Sequelize.INTEGER,
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
      unique: true
    }
  }, {
    associate: function (models) {
      User.belongsTo(models.Roles);
      User.hasOne(models.Keys, {
        onDelete: "cascade"
      });
    }
  });
  return User;
};

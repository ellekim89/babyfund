'use strict';
module.exports = function(sequelize, DataTypes) {
  var kid = sequelize.define('kid', {
    name: DataTypes.STRING,
    birthday: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.kid.belongsTo(models.user,{foreignKey: 'user_id'});
        models.kid.hasMany(models.comment)
      }
    }
  });
  return kid;
};
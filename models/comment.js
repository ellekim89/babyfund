'use strict';
module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define('comment', {
    text: DataTypes.STRING,
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    kid_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.comment.belongsTo(models.kid, {foreignKey: 'kid_id'});
      }
    }
  });
  return comment;
};
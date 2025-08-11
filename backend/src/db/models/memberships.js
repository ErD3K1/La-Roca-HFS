const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const memberships = sequelize.define(
    'memberships',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

points: {
        type: DataTypes.INTEGER,

      },

expiry_date: {
        type: DataTypes.DATE,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  memberships.associate = (db) => {

    db.memberships.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.memberships.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return memberships;
};


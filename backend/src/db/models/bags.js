const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const bags = sequelize.define(
    'bags',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

code: {
        type: DataTypes.TEXT,

      },

price: {
        type: DataTypes.DECIMAL,

      },

status: {
        type: DataTypes.ENUM,

        values: [

"registered",

"in_transit",

"delivered"

        ],

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

  bags.associate = (db) => {

    db.bags.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.bags.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return bags;
};


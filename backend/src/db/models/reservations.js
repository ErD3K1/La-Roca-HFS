const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const reservations = sequelize.define(
    'reservations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

reservation_date: {
        type: DataTypes.DATE,

      },

pickup_location: {
        type: DataTypes.ENUM,

        values: [

"concierge",

"apartment",

"new_concierge"

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

  reservations.associate = (db) => {

    db.reservations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.reservations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return reservations;
};


'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
       type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: 'id'
          },
          onDelete:'CASCADE'
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          checkAddress(value){
            let wordsSplit = value.split(' ')
          if(!isNaN(wordsSplit[0])) {
            throw new Error('Invalid Address')
          }
        }
        }
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      lng: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false

      },
      avgRating: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      previewImage: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots"

    return queryInterface.dropTable(options);
  }
};

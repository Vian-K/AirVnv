'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages"
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "1234",
          preview: true

        },
        {
          spotId: 2,
          url: "12345",
          preview: true

        },
        {
          spotId: 3,
          url: "123456",
          preview: true

        }
      ]
    )

  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages"
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3]}
      }
    )
      }
};

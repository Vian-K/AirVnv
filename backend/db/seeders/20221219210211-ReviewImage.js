'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages'
    return queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "123",

        },
        {
          reviewId: 2,
          url: "1234",

        },
        {
          reviewId: 3,
          url: "12345",

        },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
options.tableName = "ReviewImages"
const Op = Sequelize.Op
return queryInterface.bulkDelete(
  options,
  {
    reviewId: { [Op.in]: [1, 2, 3]}
  }
)
  }
};

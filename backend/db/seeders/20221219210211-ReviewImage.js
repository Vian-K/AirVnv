'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    await queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: 123,

        },
        {
          reviewId: 1,
          url: 1234,

        },
        {
          reviewId: 1,
          url: 12345,

        },
      ]
    )
  },

  async down (queryInterface, Sequelize) {
options.tableName = "ReviewImages"
const Op = Sequelize.Op
await queryInterface.bulkDelete(
  options,
  {
    url: { [Op.in]: [123 , 1234, 12345]}
  }
)
  }
};

'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings'

    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          spotId: 1,
          startDate: 12-19-2022,
          endDate: 12-19-2022

        },
        {
          userId: 2,
          spotId: 2,
          startDate: 12-19-2022,
          endDate: 12-19-2022

        }
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Reviews"
    const Op = Sequelize.Op
    await queryInterface.bulkDelete(
      options,
      {
        userId: {[Op.in]: [1,2]}
      }
    )
  }
};

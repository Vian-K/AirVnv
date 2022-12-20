'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 tester",
          city: "tester",
          state: "test",
          country: "Testercountry" ,
          lat: 35.000000,
          lng: 36.00000,
          name: "tester1",
          description: "this is a tester",
          price: 123,


        },
        {
          ownerId: 2,
          address: "1234 tester",
          city: "tester2",
          state: "test2",
          country: "Testercountry2" ,
          lat: 35.0000002,
          lng: 36.000002,
          name: "tester2",
          description: "this is a tester",
          price: 123,

        }
      ], {})

  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Spots"
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["tester1", "tester2"]}
      }
    )

  }
};

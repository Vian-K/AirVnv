'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews'
    return queryInterface.bulkInsert(
      options,
      [
        {

          userId: 1,
          spotId: 1, //house 1
          review: "This is the first review!",
          stars: 5,
        },
        {

          userId: 2,
          spotId: 1, //house 1
          review: "This is the second review!",
          stars: 3,
        },
        {

          userId: 1,
          spotId: 2, //house 2
          review: "This is the first review",
          stars: 2,
        },
        {

          userId: 2,
          spotId: 2, //house 2
          review: "This is the second review!",
          stars: 3,
        },
        {

          userId: 1,
          spotId: 3, //house
          review: "This was an first review!",
          stars: 4,
        },
        {

          userId: 2,
          spotId: 3, //house 
          review: "This was an second review!",
          stars: 2,
        }
      ], {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews"
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3]}
      }
    )
  }
};

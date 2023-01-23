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
          url: "https://a0.muscache.com/im/pictures/b0c977d9-57ba-4f70-bbb4-8b3cd3ae8dc4.jpg?im_w=720",
          preview: true

        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/a017859a-f4b8-499b-b871-f830b6053ad6.jpg?im_w=720",
          preview: true

        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-33309759/original/23cc7524-c74c-4beb-b38e-b9be24ba6249.jpeg?im_w=720",
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

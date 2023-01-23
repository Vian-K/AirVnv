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
          url: "https://a0.muscache.com/im/pictures/66b36bec-33e1-4b6d-b5b3-7a89faed5d30.jpg?im_w=720",
          preview: true

        },
        {
          spotId: 2,
          url: "https://a0.muscache.com/im/pictures/0eb500ca-0f15-4889-9e1b-6156699b9505.jpg?im_w=720",
          preview: true

        },
        {
          spotId: 3,
          url: "https://a0.muscache.com/im/pictures/3721c4eb-3da9-4526-8a19-7307de85fa1a.jpg?im_w=1200",
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

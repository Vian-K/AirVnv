'use strict';
const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {foreignKey: 'ownerId'})
      Spot.hasMany(models.Review, {foreignKey: 'spotId'})
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId'})
      Spot.hasMany(models.Booking, {foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type:DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        // checkUpperCase(value){
        //   let word = value.split('')
        //   word.forEach(letter => {
        //     if(!letter[0].isUpperCase()) {
        //       throw new Error('Capitilize letter')
        //     }

        //   })
        // }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        // checkUpperCase(value){
        //   let word = value.split('')
        //   word.forEach(letter => {
        //     if(!letter[0].isUpperCase()) {
        //       throw new Error('Capitilize letter')
        //     }

        //   })
        // }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        // checkUpperCase(value){
        //   let word = value.split('')
        //   word.forEach(letter => {
        //     if(!letter[0].isUpperCase()) {
        //       throw new Error('Capitilize letter')
        //     }

        //   })
        // }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isFloat: true,
      }
    },
    lng:{
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isFloat: true,
      }
    },
    name: {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false

    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,

    },
    updatedAt:  {
      type: DataTypes.DATE,

    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

const Sequelize = require('sequelize');

const HeroiSchema = {
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING,
      required: true
    },
    poder: {
      type: Sequelize.STRING,
      require: true
    }
  },
  options: {
    tableName: 'tb_herois',
    freezeTableName: false,
    timestamps: false
  }
};

module.exports = HeroiSchema;
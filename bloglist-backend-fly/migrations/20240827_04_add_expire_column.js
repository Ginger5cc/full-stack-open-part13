const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('sessions', 'expire', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('sessions', 'expire')
  },
}
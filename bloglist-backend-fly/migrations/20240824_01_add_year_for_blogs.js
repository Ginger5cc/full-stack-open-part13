const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
        type : DataTypes.INTEGER,
        validate: {
          validateYear(value) {
            const currentYear = new Date().getFullYear()
            if (value < 1991 || value > currentYear) {
              throw new Error("Year needs to be between 1991 and current year.");
            }
          },
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}
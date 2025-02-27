'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('lessons', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      classId:{
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model:"classes",
          key:"id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("lessons");
  }
};

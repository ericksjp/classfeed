"use strict";

const { QueryInterface } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("feedbacks", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      lessonId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "lessons",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      anonymous: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      content: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },

      methodology: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },

      engagement: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5,
        },
      },
    });
    await queryInterface.removeConstraint("feedbacks", "feedbacks_primary_key");

    await queryInterface.addConstraint("feedbacks", {
      fields: ["id"],
      type: "primary key",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("feedbacks", "feedbacks_primary_key");
    await queryInterface.dropTable("feedbacks");
  },
};

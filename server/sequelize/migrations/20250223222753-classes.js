'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("classes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      subject: {
          type: Sequelize.STRING,
          allowNull: false
      },
      institution: {
          type: Sequelize.STRING,
          allowNull: false
      },
      status: {
          type: Sequelize.ENUM,
          values: ["Ativo", "Arquivado"],
          allowNull: false
      },
      location: {
          type: Sequelize.GEOMETRY('POINT'),
          allowNull: true
      },
      teacher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }
    });

    await queryInterface.createTable("user_class", {
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      class_id: {
        type: Sequelize.UUID,
        references: {
          model: "classes",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      }
    });

    await queryInterface.addConstraint("user_class", {
      fields: ["user_id", "class_id"],
      type: "primary key",
      name: "user_class_primary_key"
    });
  },
  

  async down (queryInterface, Sequelize) {

    await queryInterface.removeConstraint("user_class", "user_class_primary_key");

    await queryInterface.dropTable("user_class");

    await queryInterface.dropTable("classes");
  }
};

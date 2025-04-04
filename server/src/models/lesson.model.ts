import { Model, DataTypes, Sequelize, ModelStatic } from "sequelize";
import Feedback from "./feedback.model";
import { validateModels } from "../utils";

class Lesson extends Model {
  public readonly id!: string;
  public name!: string;
  public dateTime!: Date;
  public classId!: string;

  public readonly Feedbacks?: Feedback[];

  public static associate(models: { [key: string]: ModelStatic<Model> }) {
    validateModels("Lesson", ["Class", "Feedback"], models);

    this.belongsTo(models.Class, {
      foreignKey: "classId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.hasMany(models.Feedback, {
      foreignKey: "lessonId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        classId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Lesson",
        tableName: "lessons",
        timestamps: false,
      },
    );
  }
}

export default Lesson;

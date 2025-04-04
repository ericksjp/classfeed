import { Model, DataTypes, ModelStatic } from "sequelize";
import { Sequelize } from "sequelize";
import { validateModels } from "../utils";

class Feedback extends Model {
  public readonly id!: string;
  public lessonId!: string;
  public studentId!: string;
  public anonymous!: boolean;
  public comment!: string | null;
  public content!: number | null;
  public methodology!: number | null;
  public engagement!: number | null;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,  
        },
        lessonId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "lessons",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        anonymous: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        content: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 1,
            max: 5,
          },
        },
        methodology: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 1,
            max: 5,
          },
        },
        engagement: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            min: 1,
            max: 5,
          },
        },
      },
      {
        sequelize,
        modelName: "Feedback",
        tableName: "feedbacks",
        timestamps: false,
      },
    );
  }

  public static associate(models: { [key: string]: ModelStatic<Model> }) {
    validateModels("Feedback", ["Lesson", "User"], models);

    this.belongsTo(models.Lesson, {
      foreignKey: "lessonId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.User, {
      foreignKey: "studentId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

export default Feedback;

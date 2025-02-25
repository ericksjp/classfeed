import { Model, DataTypes, Sequelize } from "sequelize";

class Lesson extends Model {
  public readonly id!: string;
  public name!: string;
  public dateTime!: Date;
  public classId!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static associate(models: any) {
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false,
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
      }
    );
  }
}

export default Lesson;

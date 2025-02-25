import { DataTypes, Model } from "sequelize";

import User from "./user.model";
import { Sequelize } from "sequelize";

type LocationType = {
  type: "Point";
  coordinates: [number, number];
};

class Class extends Model {
  public readonly id!: string;
  public name!: string;
  public subject!: string;
  public institution!: string;
  public status!: string;
  public location?: LocationType;
  public teacherId!: string;

   public static associate(models: { User: typeof User }) {
    this.belongsToMany(models.User, {
      through: 'user_class',
      foreignKey: 'classId',
      otherKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    this.belongsTo(models.User, {
      foreignKey: 'teacherId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
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
        subject: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        institution: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["Ativo", "Arquivado"],
          allowNull: false,
        },
        location: {
          type: DataTypes.GEOMETRY("POINT"),
          allowNull: true,
        },
        teacherId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
          field: "teacherId",
        },
      },
      {
        sequelize,
        modelName: "Class",
        tableName: "classes",
        timestamps: false,
      },
    );
  }
}
export default Class

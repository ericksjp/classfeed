import { Association, HasManyCreateAssociationMixin, HasManyRemoveAssociationMixin, Sequelize } from "sequelize";
import { Model, DataTypes } from "sequelize";
import Class from "./class.model";

class User extends Model {
  public readonly id!: string;
  public name!: string;
  public email!: string;
  public profilePicture?: string;
  public dateOfBirth!: Date;
  public password!: string;

  public createClass!: HasManyCreateAssociationMixin<Class>
  public removeClass!: HasManyRemoveAssociationMixin<Class, string>

  // Populated for inclusions
  public readonly classes?: Class[]

  public static associations: {
      classes: Association<User, Class>
  }

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 public static associate(models: any) {
    this.belongsToMany(models.Class, {
      through: "user_class",
      foreignKey: "userId",
      otherKey: "classId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.hasMany(models.Class, {
      foreignKey: "teacherId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    this.hasMany(models.Feedback, {
      foreignKey: "studentId",
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        profilePicture: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false,
      },
    );
  }
}

export default User;

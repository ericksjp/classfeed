import { Association, HasManyCreateAssociationMixin, HasManyRemoveAssociationMixin, ModelStatic, Sequelize } from "sequelize";
import { Model, DataTypes } from "sequelize";
import Class from "./class.model";
import { hashSync } from "bcryptjs";
import { buildImageUrl } from "../utils/imageUrl";
import { sanitizeObject, validateModels } from "../utils";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  profilePicture: string;
};

class User extends Model {
  public readonly id!: string;
  public name!: string;
  public email!: string;
  public profilePicture!: string;
  public dateOfBirth!: Date;
  public password!: string;

  public createClass!: HasManyCreateAssociationMixin<Class>
  public removeClass!: HasManyRemoveAssociationMixin<Class, string>

  // Populated for inclusions
  public readonly classes?: Class[]

  public static associations: {
      classes: Association<User, Class>
  }

  // Getter function to return a sanitized user object
  public getPublicProfile(reqProtocol: string, reqHost: string): PublicUser {
    return sanitizeObject(this.dataValues, {
      password: () => undefined,
      profilePicture: () => buildImageUrl(reqProtocol, reqHost, this.profilePicture),
    }) as PublicUser
  }

  public static associate(models: { [key: string]: ModelStatic<Model> }) {
    validateModels("User", ["Class", "Feedback"], models);

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
          allowNull: false,
          defaultValue: "default_profile_picture.png"
        },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          set(value: string) {
            this.setDataValue("password", hashSync(value, 10))
          }
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

import { Model, DataTypes } from "sequelize";

import db from ".";

class User extends Model {
  public readonly id!: string;
  public name!: string;
  public email!: string;
  public profilePicture?: string;
  public dateOfBirth!: Date;
  public password!: string;
}

User.init(
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
    tableName: "users",
    sequelize: db,
    timestamps: false,
  },
);

export default User;

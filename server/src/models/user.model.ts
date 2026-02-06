import {
    Association,
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,
    ModelStatic,
    Sequelize,
} from "sequelize";
import { Model, DataTypes } from "sequelize";
import Class from "./class.model";
import { sanitizeObject, validateModels } from "../utils";
import storageService from "../services/storage.service";

export type UserType = {
    id: string;
    name: string;
    email: string;
    birthDate: Date;
    profilePicture: string;
    password: string;
};

export type UserWithoutId = Omit<UserType, "id">;

export type PublicUser = {
    id: string;
    name: string;
    email: string;
    birthDate: Date;
    profilePicture: string;
};

class User extends Model {
    public readonly id!: string;
    public name!: string;
    public email!: string;
    public profilePicture!: string;
    public birthDate!: Date;
    public password!: string;

    public createClass!: HasManyCreateAssociationMixin<Class>;
    public removeClass!: HasManyRemoveAssociationMixin<Class, string>;

    // Populated for inclusions
    public readonly classes?: Class[];

    public static associations: {
        classes: Association<User, Class>;
    };

    // Getter function to return a sanitized user object
    public getPublicProfile(): PublicUser {
        return sanitizeObject(this.dataValues, {
            password: () => undefined,
            profilePicture: () => storageService.getPublicUrl(this.profilePicture)
        }) as PublicUser;
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
                    defaultValue: "default_profile_picture.png",
                },
                birthDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
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

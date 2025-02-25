import { DataTypes, Model } from "sequelize";

import db from  ".";
import User from "./user.model";
import Class from "./class.model";

class UserClass extends Model {
    public readonly userId!: string;
    public readonly classId!: string;
}

UserClass.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        field: "user_id"
    },
    classId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Class,
            key: "id"
        },
        field: "class_id"
    }
},
{
    tableName: "user_class",
    sequelize: db,
    timestamps: false
}
);

export default UserClass;
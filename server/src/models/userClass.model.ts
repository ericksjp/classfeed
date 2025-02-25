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
        references: {
            model: User,
            key: "id"
        }
    },
    classId: {
        type: DataTypes.UUID,
        references: {
            model: Class,
            key: "id"
        }
    }
},
{
    tableName: "user-class",
    sequelize: db,
    timestamps: false
}
);

export default UserClass;
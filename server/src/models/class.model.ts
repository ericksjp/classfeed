import { DataTypes, Model } from "sequelize";

import db from ".";
import User from "./user.model";

type LocationType = {
    type: "Point";
    coordinates: [number, number];
}

class Class extends Model {
    public readonly id!: string;
    public name!: string;
    public subject!: string;
    public institution!: string;
    public status!: string;
    public location?: LocationType;
    public teacherId!: string;
}

Class.init(
{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        values: ["Ativo", "Arquivado"],
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: true
    },
    teacherId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }
},
{
    tableName: "classes",
    sequelize: db,
    timestamps: false
}
);

export default Class;
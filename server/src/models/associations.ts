import User from "./user.model"; 
import Class from "./class.model";
import UserClass from "./userClass.model";

User.hasMany(Class, { foreignKey: "teacherId" });
Class.belongsTo(User, { foreignKey: "teacherId" });

User.belongsToMany(Class, {
    through: UserClass,
    foreignKey: "userId"
});

Class.belongsToMany(User, {
    through: UserClass,
    foreignKey: "classId"
}); 

export { User, Class };
import User from "./user.model"; 
import Class from "./class.model";
import UserClass from "./userClass.model";

User.hasMany(Class, { foreignKey: "teacher_id" });
Class.belongsTo(User, { foreignKey: "teacher_id" });

User.belongsToMany(Class, {
    through: UserClass,
    foreignKey: "user_id"
});

Class.belongsToMany(User, {
    through: UserClass,
    foreignKey: "class_id"
}); 

export { User, Class };
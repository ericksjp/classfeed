import User from "./user.model"; 
import Class from "./class.model";

User.hasMany(Class, { foreignKey: "teacherId" });
Class.belongsTo(User, { foreignKey: "teacherId" });

User.belongsToMany(Class, { through: "user-class" });
Class.belongsToMany(User, { through: "user-class" }); 

export { User, Class };
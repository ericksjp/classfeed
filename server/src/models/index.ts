import { Sequelize } from 'sequelize'
import config from '../config/sequelize'
import User from './user.model';
import Class from './class.model';
import Lesson from './lesson.model';
import Feedback from './feedback.model';

const sequelize = new Sequelize(config);

const models = {User, Class, Lesson, Feedback}
Object.values(models).forEach(model => model.initialize(sequelize))
Object.values(models).forEach(model => model.associate && model.associate(models))

export {
  sequelize, User, Class, Lesson, Feedback
}

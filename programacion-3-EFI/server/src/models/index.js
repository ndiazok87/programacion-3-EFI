import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import ResourceModel from './resource.js';
import UserModel from './user.js';
import ProfileModel from './profile.js';
import PlotModel from './plot.js';
import ActivityModel from './activity.js';
import WorkerModel from './worker.js';
import ActivityAssignmentModel from './activityAssignment.js';
import PasswordResetModel from './passwordReset.js';

dotenv.config();

// Choose SQLite for development, MySQL for production
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
let sequelize;

if (isDev) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dev.sqlite',
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    dialect: 'mysql',
    logging: false,
  });
}

const User = UserModel(sequelize);
const Profile = ProfileModel(sequelize);
const Resource = ResourceModel(sequelize);
const Plot = PlotModel ? PlotModel(sequelize) : null;
const Activity = ActivityModel ? ActivityModel(sequelize) : null;
const Worker = WorkerModel ? WorkerModel(sequelize) : null;
const ActivityAssignment = ActivityAssignmentModel ? ActivityAssignmentModel(sequelize) : null;
const PasswordReset = PasswordResetModel ? PasswordResetModel(sequelize) : null;

// Associations (approximate mappings from the original SQL)
if (Profile && User) {
  // profile.id references auth.users(id) originally; here we keep profile.id = user.id
  Profile.belongsTo(User, { foreignKey: 'id', targetKey: 'id' });
}

if (Plot && Activity) {
  Plot.hasMany(Activity, { foreignKey: 'id_parcela', onDelete: 'CASCADE' });
  Activity.belongsTo(Plot, { foreignKey: 'id_parcela', as: 'plots' });
}

if (Plot && Resource) {
  Plot.hasMany(Resource, { foreignKey: 'id_parcela', onDelete: 'CASCADE' });
  Resource.belongsTo(Plot, { foreignKey: 'id_parcela' });
}

if (Worker && Profile) {
  Worker.belongsTo(Profile, { foreignKey: 'id_usuario', as: 'profiles' });
  Profile.hasOne(Worker, { foreignKey: 'id_usuario' });
}

if (Activity && ActivityAssignment && Worker) {
  Activity.hasMany(ActivityAssignment, { foreignKey: 'id_actividad' });
  Worker.hasMany(ActivityAssignment, { foreignKey: 'id_trabajador' });
}

export { sequelize, User, Profile, Resource, Plot, Activity, Worker, ActivityAssignment };
export { PasswordReset };

import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointment';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
    this.mongo();
  }

  init() {
    models
      .map(model => model.init(this.connection))
      .map(model => model.assosiate && model.assosiate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();

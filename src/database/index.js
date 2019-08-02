import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointment';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
  }

  init() {
    models
      .map(model => model.init(this.connection))
      .map(model => model.assosiate && model.assosiate(this.connection.models));
  }
}

export default new Database();

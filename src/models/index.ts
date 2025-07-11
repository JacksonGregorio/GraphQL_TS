import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';

const config = databaseConfig.development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as any,
});

export { sequelize };
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  models: [path.join(__dirname, '../models/**/*.model.ts')],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;

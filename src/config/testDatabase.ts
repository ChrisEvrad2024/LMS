import { Sequelize } from 'sequelize-typescript';
import path from 'path';

const testSequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {
  logging: false,
  models: [path.join(__dirname, '../models/**/*.model.ts')]
});

export default testSequelize;

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions:DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'faucet',
  entities:['dist/**/*.entity.js'],
  migrations:['dist/db/migrations/*.js'],
  // logging:true
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
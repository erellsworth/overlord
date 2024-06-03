import { Sequelize, Options } from 'sequelize';

const dbOptions: Options = {
    dialect: 'postgres',
    logging: false
};

if (process.env.APP_ENV === 'prod') {
    dbOptions.dialectOptions = {
        ssl: {
            require: process.env.APP_ENV === 'prod',
            rejectUnauthorized: false
        }
    };
}

const url = process.env.DB_CONNECTION_STRING as string
const db = new Sequelize(url, dbOptions);

export {
    db
}
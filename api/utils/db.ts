import { Sequelize, Options } from 'sequelize';

const dbOptions: Options = {
    dialect: 'postgres',
};

if (process.env.APP_ENV === 'prod') {
    dbOptions.dialectOptions = {
        ssl: {
            require: process.env.APP_ENV === 'prod',
            rejectUnauthorized: false
        }
    };
}

const db = new Sequelize(process.env.DB_CONNECTION_STRING as string, dbOptions);

export {
    db
}
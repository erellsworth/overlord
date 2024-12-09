import { Sequelize, Options } from 'sequelize';

const { APP_ENV, DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT, CA_CERT } = process.env;

const dbOptions: Options = {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
    port: parseInt(DB_PORT as string || '25060')
};

if (APP_ENV === 'prod') {
    dbOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: CA_CERT
        }
    };
}

const db = new Sequelize(DB_NAME as string, DB_USER as string, DB_PASS, dbOptions);

export {
    db
}
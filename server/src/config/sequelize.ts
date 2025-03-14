import "dotenv/config";
import type { Options } from "sequelize";

interface ConfigTs {
    development: Options;
    test: Options;
    production: Options;
}

const { DB_USER, DB_PASSWORD, DB_NAME, DOCKER_DB_HOST, NODE_ENV } = process.env
const DB_HOST = DOCKER_DB_HOST || process.env.DB_HOST;
const env = (NODE_ENV || 'development') as keyof ConfigTs;

const configDB: ConfigTs = {
    development: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "postgres",
        dialectOptions: {
            charset: "utf8",
        },
        define: {
            timestamps: false,
        },
    },
    test: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "postgres",
        dialectOptions: {
            charset: "utf8",
        },
        define: {
            timestamps: false,
        },
    },
    production: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        dialect: "postgres",
        dialectOptions: {
            charset: "utf8",
            multipleStatements: true,
        },
        logging: false,
        define: {
            timestamps: false,
        },
    },
};

export = configDB[env]

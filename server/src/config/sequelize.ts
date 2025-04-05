import "dotenv/config";
import type { Options } from "sequelize";
import { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, NODE_ENV } from "./config"

interface ConfigTs {
    development: Options;
    test: Options;
    production: Options;
}

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

export = configDB[NODE_ENV]

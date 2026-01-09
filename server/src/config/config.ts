import dotenv from "dotenv";
import fs from "node:fs";
dotenv.config();

function getBucketDirectory(): string {
    const dirPath = process.env.FILE_STORAGE_PATH;

    if (!dirPath) {
        throw new Error("Invalid or missing ENV: FILE_STORAGE_PATH");
    }

    if (!fs.existsSync(dirPath)) {
        throw new Error(`FILE_STORAGE_PATH "${dirPath}" does not exist`);
    }

    try {
        fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
        throw new Error(`No read/write access to FILE_STORAGE_PATH "${dirPath}"`);
    }

    return dirPath;
}

function getExpirationTime(name: string, env?: string): number {
    if (!env || env.length < 2) {
        throw new Error(`Invalid or missing ENV: ${name}`);
    }

    const timeValue = parseInt(env.slice(0, -1), 10);
    if (!timeValue) {
        throw new Error(`Invalid or missing ENV: ${name}`);
    }

    const timeUnit = env.at(-1);
    let multiplier = 0;

    const SECOND = 1000 * 60;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    switch (timeUnit) {
        case "s":
            multiplier = SECOND;
            break;
        case "m":
            multiplier = MINUTE;
            break;
        case "h":
            multiplier = HOUR;
            break;
        case "d":
            multiplier = DAY;
            break;
        case "w":
            multiplier = DAY * 7;
            break;
        case "M":
            multiplier = DAY * 30;
            break;
        case "Y":
            multiplier = DAY * 365;
            break;
        default:
            throw new Error("Invalid or missing ENV: FILE_STORAGE_PATH");
    }

    return timeValue * multiplier;
}

function getNodeEnv() {
    const NODE_ENV = process.env.NODE_ENV as "production" | "development" | "test";

    if (!["production", "development", "test"].includes(NODE_ENV)) {
        throw new Error("Invalid or missing ENV: NODE_ENV");
    }

    return NODE_ENV;
}

type MailEnvs = {
    MAIL_PASSWORD: string;
    MAIL_HOST: string;
    MAIL_USER: string;
    MAIL_PORT: number;
};

function verifyMailEnvs(): MailEnvs {
    const vals: Partial<MailEnvs> = {
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_USER: process.env.MAIL_USER,
        MAIL_PORT: parseInt(process.env.MAIL_PORT as string, 10) || undefined,
    };

    Object.keys(vals).forEach((key: string) => {
        if (vals[key as keyof MailEnvs] === undefined) {
            throw new Error(`Invalid or missing ENV: ${key}`);
        }
    });

    return vals as MailEnvs;
}

function initializeConfig() {
    const PORT = parseInt(process.env.SERVER_PORT as string, 10);
    if (isNaN(PORT)) {
        throw new Error("Invalid or missing ENV: SERVER_PORT");
    }

    const DB_USER = process.env.DB_USER || "postgres";
    const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
    const DB_NAME = process.env.DB_NAME || "classfeed";
    const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
    const DB_HOST = process.env.DOCKER_DB_HOST || process.env.DB_HOST || "localhost";
    const JWT_EXPTIME = getExpirationTime("JWT_EXPTIME", process.env.JWT_EXPTIME);
    const OTP_EXPTIME = getExpirationTime("OTP_EXPTIME", process.env.JWT_EXPTIME);
    const NODE_ENV = getNodeEnv();
    const FILE_STORAGE_PATH = getBucketDirectory();
    const FRONTEND_URL = process.env.FRONTEND_URL;

    if (!FRONTEND_URL) {
        throw new Error("Invalid or missing ENV: FRONTEND_URL");
    }

    const { MAIL_PASSWORD, MAIL_HOST, MAIL_USER, MAIL_PORT } = verifyMailEnvs();

    return {
        MAIL_PASSWORD,
        MAIL_HOST,
        MAIL_USER,
        MAIL_PORT,
        PORT,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
        DB_HOST,
        JWT_SECRET,
        JWT_EXPTIME,
        OTP_EXPTIME,
        NODE_ENV,
        FILE_STORAGE_PATH,
        FRONTEND_URL,
    };
}

const config = initializeConfig();

export = config;

import dotenv from "dotenv";

dotenv.config();

// types

type NodeEnv = "production" | "development" | "test";

type MailConfig = {
    MAIL_PASSWORD: string;
    MAIL_HOST: string;
    MAIL_USER: string;
    MAIL_PORT: number;
};

type S3Config = {
    S3_BUCKET_NAME: string;
    S3_FORCE_PATH_STYLE: boolean;
    S3_ENDPOINT?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_REGION: string;
    S3_PUBLIC_URL: string;
};

// HELPERS

function parseDuration(envName: string, value?: string): number {
    if (!value || value.length < 2) {
        throw new Error(`Invalid duration format for ENV: ${envName}`);
    }

    const amount = parseInt(value.slice(0, -1), 10);
    const unit = value.at(-1);

    if (isNaN(amount)) {
        throw new Error(`Invalid numeric value for ENV: ${envName}`);
    }

    const SECOND = 1_000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    switch (unit) {
        case "s": return amount * SECOND;
        case "m": return amount * MINUTE;
        case "h": return amount * HOUR;
        case "d": return amount * DAY;
        case "w": return amount * DAY * 7;
        case "M": return amount * DAY * 30;
        case "Y": return amount * DAY * 365;
        default: throw new Error(`Invalid time unit "${unit}" in ENV: ${envName}`);
    }
}

function requireEnvs<T>(values: Record<string, string | number | boolean | undefined>, scope: string): T {
    const missingKeys = Object.keys(values).filter((key) => {
        const val = values[key];
        return val === undefined || val === null || (typeof val === "number" && isNaN(val));
    });

    if (missingKeys.length > 0) {
        throw new Error(`[${scope}] Missing required ENVs: ${missingKeys.join(", ")}`);
    }

    return values as T;
}

function getNodeEnv(): NodeEnv {
    const env = process.env.NODE_ENV as NodeEnv;
    if (!["production", "development", "test"].includes(env)) {
        throw new Error("Invalid or missing ENV: NODE_ENV");
    }
    return env;
}

function initializeConfig() {
    const PORT = parseInt(process.env.SERVER_PORT as string, 10);
    if (isNaN(PORT)) throw new Error("Missing ENV: SERVER_PORT");

    const FRONTEND_URL = process.env.FRONTEND_URL;
    if (!FRONTEND_URL) throw new Error("Missing ENV: FRONTEND_URL");

    const NODE_ENV = getNodeEnv();

    const DB_HOST = process.env.DOCKER_DB_HOST || process.env.DB_HOST || "localhost";
    const DB_NAME = process.env.DB_NAME || "classfeed";
    const DB_USER = process.env.DB_USER || "postgres";
    const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";

    const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
    const JWT_EXPTIME = parseDuration("JWT_EXPTIME", process.env.JWT_EXPTIME);
    const OTP_EXPTIME = parseDuration("OTP_EXPTIME", process.env.OTP_EXPTIME || process.env.JWT_EXPTIME);

    const mailConfig = requireEnvs<MailConfig>({
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_USER: process.env.MAIL_USER,
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        MAIL_PORT: parseInt(process.env.MAIL_PORT as string, 10),
    }, "Mail Service");

    const s3Config = requireEnvs<S3Config>({
        AWS_REGION: process.env.AWS_REGION,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE === "true",
        S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
    }, "Storage Service");

    // optional s3 configs
    s3Config.S3_ENDPOINT = process.env.S3_ENDPOINT;
    s3Config.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    s3Config.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

    return {
        PORT,
        NODE_ENV,
        FRONTEND_URL,
        // Database
        DB_HOST,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
        // Auth
        JWT_SECRET,
        JWT_EXPTIME,
        OTP_EXPTIME,
        // validated groups
        ...mailConfig,
        ...s3Config,
    };
}

const config = initializeConfig();

export = config;

import dotenv from 'dotenv';
import fs from "node:fs"
dotenv.config();

function getBucketDirectory(): string {
  const dirPath = process.env.FILE_STORAGE_PATH

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

function getTokenExpirationTime(): number {
  const expirationTime = process.env.JWT_EXPTIME;

  if (!expirationTime || expirationTime.length < 2) {
    throw new Error("Invalid or missing ENV: JWT_EXPTIME");
  }

  const timeValue = parseInt(expirationTime.slice(0, -1), 10);
  if (!timeValue) {
    throw new Error("Invalid or missing ENV: JWT_EXPTIME");
  }

  const timeUnit = expirationTime.at(-1);
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
  const NODE_ENV = process.env.NODE_ENV as
    | "production"
    | "development"
    | "test";

  if (!["production", "development", "test"].includes(NODE_ENV)) {
    throw new Error("Invalid or missing ENV: NODE_ENV");
  }

  return NODE_ENV;
}

function initializeConfig() {
    const PORT = parseInt(process.env.SERVER_PORT as string, 10);
    if (isNaN(PORT)) {
        throw new Error('Invalid or missing ENV: SERVER_PORT');
    }

    const DB_USER = process.env.DB_USER || 'postgres';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
    const DB_NAME = process.env.DB_NAME || 'classfeed';
    const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
    const DB_HOST = process.env.DOCKER_DB_HOST || process.env.DB_HOST || 'localhost';
    const JWT_EXPTIME = getTokenExpirationTime();
    const NODE_ENV = getNodeEnv();
    const FILE_STORAGE_PATH = getBucketDirectory();

    return {
        PORT,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
        DB_HOST,
        JWT_SECRET,
        JWT_EXPTIME,
        NODE_ENV,
        FILE_STORAGE_PATH
    };
}

const config = initializeConfig();

export = config;

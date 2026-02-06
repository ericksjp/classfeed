import { CorsOptions } from "cors";
import { FRONTEND_URL } from "./config";

const allowedOrigins = [FRONTEND_URL];

const options: CorsOptions = {
    origin: allowedOrigins,
    methods: "*",
    credentials: true,
    optionsSuccessStatus: 204,
};

export default options;

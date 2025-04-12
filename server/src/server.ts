import { PORT } from "./config/config";
import { sequelize } from "./models/index";
import app from "./app";
import { Server } from "http";
import transporter, { verifyTransporterConnection } from "./config/mailTransporter";

let server: Server;

async function gracefulShutdown(server: Server): Promise<void> {
  try {
    await sequelize.close();
    console.info("Closed database connection!");

    transporter.close();
    console.info("Closed transporter connection!");

    if (server) {
      server.close();
    }

    process.exit();
  } catch (error) {
    console.info((error as Error).message);
    process.exit(1);
  }
}

async function init() {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database!");
    await verifyTransporterConnection();
    console.log("Mail transporter verified!");

    server = app.listen(PORT, async () => {
      console.log(`App running on port ${PORT}...`);
    });
  } catch (error) {
    console.error(error);
    gracefulShutdown(server);
  }
}

["SIGINT", "SIGTERM", "uncaughtException", "unhandledRejection"].forEach(
  (signal: string) => {
    process.on(signal, async () => {
      await gracefulShutdown(server);
    });
  },
);

init();

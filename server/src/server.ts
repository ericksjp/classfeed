import { PORT } from './config/config';
import { sequelize } from './models/index';
import app from "./app";
import { Server } from 'http';

const server: Server = app.listen(PORT, async () => {
  console.log(`App running on port ${PORT}...`);
  try {
    await sequelize.authenticate()
    console.log('Connected to the database!')
  } catch (error) {
    console.error(error)
    gracefulShutdown(server)
  }
});

["SIGINT", "SIGTERM", "uncaughtException", "unhandledRejection"].forEach(
  (signal: string) => {
    process.on(signal, async () => {
      await gracefulShutdown(server);
    });
  },
);

async function gracefulShutdown(server: Server): Promise<void> {
    try {
      await sequelize.close();
      console.info('Closed database connection!');
      server.close(() => {
        process.exit();
      });
    } catch (error) {
      console.info((error as Error).message);
      process.exit(1);
    }
}

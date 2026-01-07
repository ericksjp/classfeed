import { createTransport } from "nodemailer";
import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "./config";
import { getErrorMessage } from "../utils";

const transporter = createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export async function verifyTransporterConnection() {
    const verifyPromise = new Promise<void>((res, rej) => {

      const timeout = setTimeout(() => {
        rej(new Error("Unable to verify transporter connection within 10 seconds."));
      }, 1000 * 10);

      transporter.verify((error) => {
        clearTimeout(timeout);
        if (error) {
          rej(new Error(`Mail transporter connection verification failed: ${getErrorMessage(error)}`));
        } else {
          res();
        }
      });
    });

    await verifyPromise;
}

export default transporter;

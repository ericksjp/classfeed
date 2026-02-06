import { UserType } from "../models/user.model";
import { OTPError } from "../errors";
import { generateOTP } from "../utils";
import NodeCache from "node-cache";

type User = Omit<UserType, "id">;

type Cached = {
    user: User;
    otp: string;
};

const userOtpCache = new NodeCache({
    stdTTL: 60 * 5,
    checkperiod: 0,
    useClones: false,
    deleteOnExpire: false,
});

userOtpCache.on("expired", (key: string) => {
    userOtpCache.del(key);
});

export function saveUser(user: User) {
    const otp = generateOTP(6);

    userOtpCache.set(user.email, {
        user,
        otp,
    });

    return otp;
}

export function retrieveUser(userIdentifier: string, OTP: string): User | undefined {
    const cached = userOtpCache.get(userIdentifier) as Cached | undefined;

    if (!cached) {
        throw new OTPError(404, "Email not Found", "ERR_OTP");
    }

    if (cached.otp !== OTP) {
        throw new OTPError(402, "Wrong OTP", "ERR_OTP");
    }

    userOtpCache.del(userIdentifier);
    return cached.user;
}

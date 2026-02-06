import transporter from "../config/mailTransporter";

export async function sendOTPMail(email: string, name: string, otp: string) {
    const mailInfo = {
        email,
        otp,
    };

    const emailSubject = "Your ClassFeed Verification Code";

    const emailText =`
    Hello ${name}!
    Use the following code to verify your email: ${mailInfo.otp} 
    (If you did not request this code, please ignore this email).
    Best regards,
    The ClassFeed Team`;

    transporter.sendMail({
        from: '"ClassFeed" <support@classfeed.com>',
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailText,
    });
}

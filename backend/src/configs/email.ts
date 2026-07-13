import nodemailer from "nodemailer";
import { GMAIL_USER, GMAIL_APP_PASSWORD } from "./constant";

export const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

export async function sendPasswordResetEmail(to: string, resetLink: string) {
    await emailTransporter.sendMail({
        from: `"SikhshaSathi" <${GMAIL_USER}>`,
        to,
        subject: "Reset your password",
        text: `You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.\n\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.`,
        html: `<p>You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
    });
}
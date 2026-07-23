import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { GMAIL_USER, GMAIL_APP_PASSWORD } from "./constant";

export const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
    // Force IPv4. Some hosts (Render included) have unreliable/broken IPv6
    // routing to Google's mail servers, which causes connect ENETUNREACH
    // errors or multi-minute hangs before falling back to IPv4. Forcing
    // IPv4 here skips that broken attempt entirely. (nodemailer/Node's
    // underlying socket layer supports this option even though the
    // published TypeScript types don't declare it, hence the assertion.)
    family: 4,
} as SMTPTransport.Options);

export async function sendPasswordResetEmail(to: string, resetLink: string) {
    await emailTransporter.sendMail({
        from: `"SikhshaSathi" <${GMAIL_USER}>`,
        to,
        subject: "Reset your password",
        text: `You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.\n\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.`,
        html: `<p>You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
    });
}
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  const host = (process.env.MAIL_HOST || "").trim();
  const user = (process.env.MAIL_USER || "").trim();
  // App passwords contain spaces — keep inner spaces, drop surrounding whitespace/newlines
  const pass = (process.env.MAIL_PASS || "").trim();
  const port = Number(process.env.MAIL_PORT) || 587;
  const secure = (process.env.MAIL_SECURE ?? (port === 465 ? "true" : "false")) === "true";

  if (!host || !user || !pass) {
    throw new Error(
      "Mail env vars missing: define MAIL_HOST, MAIL_USER, MAIL_PASS in .env.local"
    );
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      // Gmail on 587 uses STARTTLS — enforce upgrade so auth isn't sent in cleartext
      requireTLS: !secure && port === 587,
      auth: { user, pass },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
  }
  return cachedTransporter;
}

export async function mailSender(email: string, title: string, body: string) {
  const to = (email || "").trim();
  if (!to) {
    throw new Error("mailSender: recipient email is empty");
  }
  const fromAddress = (process.env.MAIL_USER || "").trim();
  try {
    const info = await getTransporter().sendMail({
      from: `StudyNotion <${fromAddress}>`,
      to,
      subject: title,
      html: body,
    });
    console.log(`Mail sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`mailSender failed for ${to}:`, message);
    // Surface actionable hints for the common Gmail failures
    if (/Invalid login|Username and Password not accepted|535/i.test(message)) {
      throw new Error(
        "Email auth failed (Gmail rejected MAIL_USER/MAIL_PASS). Generate a fresh App Password and update MAIL_PASS."
      );
    }
    throw error instanceof Error ? error : new Error(message);
  }
}

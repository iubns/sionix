import nodemailer from "nodemailer";

interface SendVerificationEmailInput {
  to: string;
  verificationUrl: string;
}

function getMailerFromEnv() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendVerificationEmail(
  input: SendVerificationEmailInput,
): Promise<void> {
  const from = process.env.SMTP_FROM ?? "no-reply@sionix.local";
  const transporter = getMailerFromEnv();

  if (!transporter) {
    console.log(`[MAIL-DEV] verify ${input.to}: ${input.verificationUrl}`);
    return;
  }

  console.log(`[MAIL] Sending verification email to ${input.to}`);
  console.log(`[MAIL] Verification URL: ${input.verificationUrl}`);
  console.log(`[MAIL] SMTP Host: ${process.env.SMTP_HOST}`);

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      subject: "[Sionix] 이메일 인증을 완료해 주세요",
      text: `아래 링크를 눌러 이메일 인증을 완료해 주세요:\n${input.verificationUrl}`,
      html: `<p>아래 링크를 눌러 이메일 인증을 완료해 주세요.</p><p><a href="${input.verificationUrl}">${input.verificationUrl}</a></p>`,
    });
  } catch (error) {
    console.warn(`[MAIL-FALLBACK] SMTP 연결 실패, 개발 모드로 전환:`);
    console.log(`[MAIL-DEV] verify ${input.to}: ${input.verificationUrl}`);
  }
}

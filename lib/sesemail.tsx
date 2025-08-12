'use server';
import {
  SESClient,
  VerifyEmailIdentityCommand,
  GetIdentityVerificationAttributesCommand,
  SendRawEmailCommand,
} from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

const sesClient = new SESClient({
  region: process.env.AWS_REGION ?? "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function verifyEmail(email: string) {
  try {
    const command = new VerifyEmailIdentityCommand({ EmailAddress: email });
    const response = await sesClient.send(command);
    console.log("Verification email sent:", response);
    return { success: true };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { success: false, error };
  }
}

export async function checkEmailStatus(
  email: string
): Promise<string | undefined> {
  const command = new GetIdentityVerificationAttributesCommand({
    Identities: [email],
  });
  const response = await sesClient.send(command);
  const status = response.VerificationAttributes?.[email]?.VerificationStatus;
  console.log(status);
  return status;
}

// Sends exactly ONE attachment (the first / only selected file)
export async function sendEmailWithAttachment(
  from: string,
  to: string,
  subject: string,
  htmlMessage: string,
  attachments?: { name: string; content: string }[]
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const errors: string[] = [];

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!from) errors.push("From address missing");
  if (!to) errors.push("To address missing");
  if (!subject) errors.push("Subject missing");
  if (!htmlMessage) errors.push("HTML body missing");
  if (from && !emailRegex.test(from)) errors.push("From address invalid");
  if (to && !emailRegex.test(to)) errors.push("To address invalid");

  if (attachments && attachments.length > 0) {
    for (const a of attachments) {
      if (!a.name) errors.push("Attachment name missing");
      if (!a.content)
        errors.push(`Attachment ${a.name || "(unnamed)"} content missing`);
      else {
        // Basic base64 validation (length multiple of 4 and only base64 chars)
        const isBase64 =
          a.content.length % 4 === 0 &&
          /^[A-Za-z0-9+/]+={0,2}$/.test(a.content);
        if (!isBase64)
          errors.push(`Attachment ${a.name} content not valid base64`);
      }
    }
  }

  if (errors.length) {
    return { success: false, error: errors.join("; ") };
  }

  let transporter;
  try {
    transporter = nodemailer.createTransport({
      SES: { ses: sesClient, aws: { SendRawEmailCommand } },
    });
  } catch (e: any) {
    return {
      success: false,
      error: `Transport creation failed: ${e?.message || "Unknown error"}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: htmlMessage,
      attachments: attachments?.map((file) => ({
        filename: file.name,
        content: Buffer.from(file.content, "base64"),
      })),
    });

    return { success: true, messageId: info.messageId };
  } catch (e: any) {
    // Sanitize known sensitive fields
    const msg = e?.message || "Unknown error sending email";
    return { success: false, error: msg };
  }
}

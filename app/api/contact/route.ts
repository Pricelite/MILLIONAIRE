import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  need?: unknown;
  message?: unknown;
  website?: unknown;
};

type ContactData = {
  name: string;
  email: string;
  need: string;
  message: string;
};

type ValidationResult =
  | {
      ok: true;
      data: ContactData;
      isSpam: boolean;
    }
  | {
      ok: false;
      error: string;
    };

const receiverEmail = "contact.studio.vcreation@gmail.com";

const fieldLimits = {
  name: 120,
  email: 180,
  need: 120,
  message: 2500
};

const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaxRequests = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validatePayload(payload: ContactPayload): ValidationResult {
  const name = cleanText(payload.name);
  const email = cleanText(payload.email).toLowerCase();
  const need = cleanText(payload.need);
  const message = cleanText(payload.message);
  const website = cleanText(payload.website);

  if (website.length > 0) {
    return {
      ok: true,
      isSpam: true,
      data: {
        name: "Spam",
        email: "spam@example.com",
        need: "Spam",
        message: "Spam"
      }
    };
  }

  if (!name || name.length > fieldLimits.name) {
    return { ok: false, error: "Le nom est obligatoire." };
  }

  if (!email || email.length > fieldLimits.email || !isValidEmail(email)) {
    return { ok: false, error: "L’adresse e-mail est invalide." };
  }

  if (!need || need.length > fieldLimits.need) {
    return { ok: false, error: "Le type de besoin est obligatoire." };
  }

  if (!message || message.length < 10 || message.length > fieldLimits.message) {
    return {
      ok: false,
      error: "Le message doit contenir entre 10 et 2500 caractères."
    };
  }

  return {
    ok: true,
    isSpam: false,
    data: { name, email, need, message }
  };
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getReceiverEmail() {
  return process.env.CONTACT_RECEIVER_EMAIL?.trim() || receiverEmail;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const current = rateLimitStore.get(identifier);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + rateLimitWindowMs
    });
    return false;
  }

  if (current.count >= rateLimitMaxRequests) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(identifier, current);
  return false;
}

function buildEmailHtml({ name, email, need, message }: ContactData) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeNeed = escapeHtml(need);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  return `
    <div style="font-family: Arial, sans-serif; color: #2f2a2c; line-height: 1.6;">
      <h1 style="color: #8b554f;">Nouvelle demande Studio V Creation</h1>
      <p><strong>Nom / entreprise :</strong> ${safeName}</p>
      <p><strong>E-mail :</strong> ${safeEmail}</p>
      <p><strong>Type de besoin :</strong> ${safeNeed}</p>
      <p><strong>Message :</strong></p>
      <p>${safeMessage}</p>
    </div>
  `;
}

function buildEmailText({ name, email, need, message }: ContactData) {
  return [
    "Nouvelle demande depuis le site Studio V Creation",
    "",
    `Nom / entreprise : ${name}`,
    `E-mail : ${email}`,
    `Type de besoin : ${need}`,
    "",
    "Message :",
    message
  ].join("\n");
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        ok: false,
        message: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes."
      },
      { status: 429 }
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Le format de la demande est invalide." },
      { status: 400 }
    );
  }

  const validation = validatePayload(payload);

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, message: validation.error },
      { status: 400 }
    );
  }

  if (validation.isSpam) {
    return NextResponse.json({
      ok: true,
      message: "Votre demande a bien été envoyée."
    });
  }

  try {
    const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
    const fromEmail = getRequiredEnv("RESEND_FROM_EMAIL");
    const toEmail = getReceiverEmail();
    const { name, email, need } = validation.data;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `Nouvelle demande Studio V Creation - ${need}`,
      text: buildEmailText(validation.data),
      html: buildEmailHtml(validation.data),
      tags: [
        {
          name: "source",
          value: "studio-v-creation-contact"
        }
      ]
    });

    if (error) {
      console.error("Resend contact email error", error);

      return NextResponse.json(
        {
          ok: false,
          message:
            "L’envoi du message a échoué. Merci de réessayer ou d’envoyer un e-mail directement."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Merci ${name}, votre demande a bien été envoyée.`
    });
  } catch (error) {
    console.error("Contact route error", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "L’envoi du message a échoué. Merci de réessayer ou d’envoyer un e-mail directement."
      },
      { status: 500 }
    );
  }
}


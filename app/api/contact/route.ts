import { BrevoClient, BrevoError } from "@getbrevo/brevo";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  need?: unknown;
  message?: unknown;
  website?: unknown;
};

type ValidationResult =
  | {
      ok: true;
      data: {
        name: string;
        email: string;
        need: string;
        message: string;
      };
      isSpam: boolean;
    }
  | {
      ok: false;
      error: string;
    };

const fieldLimits = {
  name: 120,
  email: 180,
  need: 120,
  message: 2500
};

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
      data: { name: "Spam", email: "spam@example.com", need: "Spam", message: "Spam" }
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

export async function POST(request: Request) {
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
    return NextResponse.json({ ok: true });
  }

  try {
    const apiKey = getRequiredEnv("BREVO_API_KEY");
    const senderEmail = getRequiredEnv("BREVO_SENDER_EMAIL");
    const senderName = getRequiredEnv("BREVO_SENDER_NAME");
    const receiverEmail = getRequiredEnv("CONTACT_RECEIVER_EMAIL");

    const brevo = new BrevoClient({
      apiKey,
      timeoutInSeconds: 15,
      maxRetries: 2
    });

    const { name, email, need, message } = validation.data;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeNeed = escapeHtml(need);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Nouvelle demande Studio V. Création - ${need}`,
      sender: {
        email: senderEmail,
        name: senderName
      },
      to: [{ email: receiverEmail }],
      replyTo: {
        email,
        name
      },
      textContent: [
        "Nouvelle demande depuis le site Studio V. Création",
        "",
        `Nom / entreprise : ${name}`,
        `E-mail : ${email}`,
        `Type de besoin : ${need}`,
        "",
        "Message :",
        message
      ].join("\n"),
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #2f2a2c; line-height: 1.6;">
          <h1 style="color: #8b554f;">Nouvelle demande Studio V. Création</h1>
          <p><strong>Nom / entreprise :</strong> ${safeName}</p>
          <p><strong>E-mail :</strong> ${safeEmail}</p>
          <p><strong>Type de besoin :</strong> ${safeNeed}</p>
          <p><strong>Message :</strong></p>
          <p>${safeMessage}</p>
        </div>
      `
    });

    return NextResponse.json({
      ok: true,
      message: "Votre demande a bien été envoyée."
    });
  } catch (error) {
    if (error instanceof BrevoError) {
      console.error("Brevo contact email error", {
        statusCode: error.statusCode,
        message: error.message
      });
    } else {
      console.error("Contact route error", error);
    }

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

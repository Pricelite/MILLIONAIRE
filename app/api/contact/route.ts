import { NextResponse } from "next/server";

const recipientEmail = "contact.studio.vcreation@gmail.com";
const brevoApiUrl = "https://api.brevo.com/v3/smtp/email";
const minSubmitDelayMs = 1500;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const contactAttempts = new Map<string, { count: number; resetAt: number }>();

type ContactPayload = {
  nom?: string;
  email?: string;
  telephone?: string;
  service?: string;
  message?: string;
  website?: string;
  submittedAt?: string;
};

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const currentAttempt = contactAttempts.get(ip);

  if (!currentAttempt || currentAttempt.resetAt <= now) {
    contactAttempts.set(ip, {
      count: 1,
      resetAt: now + rateLimitWindowMs
    });

    return false;
  }

  if (currentAttempt.count >= maxRequestsPerWindow) {
    return true;
  }

  currentAttempt.count += 1;
  contactAttempts.set(ip, currentAttempt);

  return false;
}

export async function POST(request: Request) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const clientIp = getClientIp(request);

  if (!brevoApiKey) {
    return NextResponse.json(
      { error: "Configuration email indisponible." },
      { status: 500 }
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Format de demande invalide." },
      { status: 400 }
    );
  }

  const nom = cleanValue(payload.nom);
  const email = cleanValue(payload.email);
  const telephone = cleanValue(payload.telephone);
  const service = cleanValue(payload.service);
  const message = cleanValue(payload.message);
  const website = cleanValue(payload.website);
  const submittedAt = Number(cleanValue(payload.submittedAt));

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: "Trop de demandes. Merci de réessayer plus tard." },
      { status: 429 }
    );
  }

  if (website) {
    return NextResponse.json({ success: true });
  }

  if (!Number.isFinite(submittedAt) || Date.now() - submittedAt < minSubmitDelayMs) {
    return NextResponse.json(
      { error: "Demande envoyée trop rapidement." },
      { status: 400 }
    );
  }

  if (!nom || !email || !service || !message) {
    return NextResponse.json(
      { error: "Nom, email, service et message sont obligatoires." },
      { status: 400 }
    );
  }

  if (nom.length > 120 || email.length > 180 || telephone.length > 30 || message.length > 2000) {
    return NextResponse.json(
      { error: "Certains champs dépassent la longueur autorisée." },
      { status: 400 }
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Le message doit contenir au moins 10 caractères." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide." },
      { status: 400 }
    );
  }

  const htmlContent = `
    <h1>Nouvelle demande Studio V Creation</h1>
    <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
      <tr><td><strong>Nom</strong></td><td>${escapeHtml(nom)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Téléphone</strong></td><td>${escapeHtml(telephone || "Non renseigné")}</td></tr>
      <tr><td><strong>Service</strong></td><td>${escapeHtml(service || "Non renseigné")}</td></tr>
      <tr><td><strong>Message</strong></td><td>${escapeHtml(message).replaceAll("\n", "<br />")}</td></tr>
    </table>
  `;

  const textContent = [
    "Nouvelle demande Studio V Creation",
    "",
    `Nom : ${nom}`,
    `Email : ${email}`,
    `Téléphone : ${telephone || "Non renseigné"}`,
    `Service : ${service || "Non renseigné"}`,
    "",
    "Message :",
    message
  ].join("\n");

  const response = await fetch(brevoApiUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "api-key": brevoApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "Studio V Creation",
        email: recipientEmail
      },
      to: [
        {
          email: recipientEmail,
          name: "Studio V Creation"
        }
      ],
      replyTo: {
        email,
        name: nom
      },
      subject: "Nouvelle demande Studio V Creation",
      htmlContent,
      textContent
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Brevo contact email failed", {
      status: response.status,
      body: errorBody
    });

    return NextResponse.json(
      { error: "Erreur lors de l’envoi du message." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}

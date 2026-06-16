import { NextResponse } from "next/server";

const recipientEmail = "contact.studio.vcreation@gmail.com";
const brevoApiUrl = "https://api.brevo.com/v3/smtp/email";

type ContactPayload = {
  nom?: string;
  email?: string;
  telephone?: string;
  service?: string;
  message?: string;
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

export async function POST(request: Request) {
  const brevoApiKey = process.env.BREVO_API_KEY;

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

  if (!nom || !email || !message) {
    return NextResponse.json(
      { error: "Nom, email et message sont obligatoires." },
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

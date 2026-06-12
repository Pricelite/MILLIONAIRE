"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

type ContactApiResponse = {
  ok: boolean;
  message?: string;
};

const defaultError =
  "Une erreur est survenue. Merci de réessayer ou d’envoyer un e-mail directement.";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setNotice("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      need: String(formData.get("need") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? "")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        setStatus("error");
        setNotice(result.message || defaultError);
        return;
      }

      form.reset();
      setStatus("success");
      setNotice(result.message || "Votre demande a bien été envoyée.");
    } catch {
      setStatus("error");
      setNotice(defaultError);
    }
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <label>
        Nom / entreprise
        <input
          name="name"
          type="text"
          placeholder="Votre nom"
          autoComplete="name"
          maxLength={120}
          required
        />
      </label>
      <label>
        Adresse e-mail
        <input
          name="email"
          type="email"
          placeholder="vous@email.fr"
          autoComplete="email"
          maxLength={180}
          required
        />
      </label>
      <label>
        Type de besoin
        <select name="need" defaultValue="Publications réseaux sociaux" required>
          <option>Publications réseaux sociaux</option>
          <option>Flyer ou affiche</option>
          <option>Carte de fidélité / cadeau</option>
          <option>Logo simple</option>
          <option>Pack complet</option>
          <option>Autre demande</option>
        </select>
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={6}
          placeholder="Décrivez votre activité, le support souhaité et votre délai."
          minLength={10}
          maxLength={2500}
          required
        />
      </label>

      <label className="honeypot" aria-hidden="true">
        Site web
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <button className="button primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Envoi en cours..." : "Envoyer la demande"}
        <Send size={17} aria-hidden="true" />
      </button>

      {notice ? (
        <p className={status === "error" ? "formError" : "formNotice"}>{notice}</p>
      ) : null}
    </form>
  );
}

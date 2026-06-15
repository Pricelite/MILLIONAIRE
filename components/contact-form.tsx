"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type FormStatus =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

const successMessage =
  "Merci pour votre message. Votre demande a bien été envoyée. Nous allons traiter votre demande dans les plus brefs délais.";

const errorMessage =
  "Une erreur est survenue. Merci de réessayer ou de nous contacter directement par email.";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      nom: String(formData.get("nom") || ""),
      email: String(formData.get("email") || ""),
      telephone: String(formData.get("telephone") || ""),
      service: String(formData.get("service") || ""),
      message: String(formData.get("message") || "")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      form.reset();
      setStatus({
        type: "success",
        message: successMessage
      });
    } catch {
      setStatus({
        type: "error",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <label>
        Nom
        <input
          name="nom"
          type="text"
          placeholder="Votre nom"
          autoComplete="name"
          maxLength={120}
          required
        />
      </label>

      <label>
        E-mail
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
        Téléphone <span className="muted">(optionnel)</span>
        <input
          name="telephone"
          type="tel"
          placeholder="07 84 14 97 13"
          autoComplete="tel"
          maxLength={30}
        />
      </label>

      <label>
        Service souhaité
        <select name="service" required defaultValue="">
          <option value="" disabled>
            Choisissez une prestation
          </option>
          <option value="Logo">Logo</option>
          <option value="Identité visuelle">Identité visuelle</option>
          <option value="Carte de visite">Carte de visite</option>
          <option value="Flyer ou affiche">Flyer ou affiche</option>
          <option value="Visuels réseaux sociaux">Visuels réseaux sociaux</option>
          <option value="Supports imprimés">Supports imprimés</option>
          <option value="Autre demande">Autre demande</option>
        </select>
      </label>

      <label>
        Message
        <textarea
          name="message"
          rows={6}
          placeholder="Décrivez votre demande."
          minLength={10}
          maxLength={2000}
          required
        />
      </label>

      <button className="button primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
        <Send size={17} aria-hidden="true" />
      </button>

      {status ? (
        <p className={`formStatus ${status.type}`} role="status" aria-live="polite">
          {status.message}
        </p>
      ) : null}

      <p className="formHelp">
        Votre demande sera envoyée à contact.studio.vcreation@gmail.com.
      </p>
    </form>
  );
}

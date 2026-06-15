"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit() {
    setIsSubmitting(true);

    window.setTimeout(() => {
      window.location.href = "/merci";
    }, 900);
  }

  return (
    <>
      <iframe
        className="formSubmitFrame"
        name="formsubmit-frame"
        title="Envoi du formulaire"
      />
      <form
        className="contactForm"
        action="https://formsubmit.co/contact.studio.vcreation@gmail.com"
        method="POST"
        target="formsubmit-frame"
        onSubmit={handleSubmit}
      >
        <input
          type="hidden"
          name="_subject"
          value="Nouvelle demande depuis Studio V Creation"
        />
        <input
          type="hidden"
          name="_next"
          value="https://studiovcreation-chi-ochre.vercel.app/merci"
        />
        <input
          type="hidden"
          name="_url"
          value="https://studiovcreation-chi-ochre.vercel.app/contact"
        />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input type="text" name="_honey" className="honeypot" tabIndex={-1} />

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
            <option value="Visuels réseaux sociaux">
              Visuels réseaux sociaux
            </option>
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

        <p className="formHelp">
          Votre demande sera envoyée à contact.studio.vcreation@gmail.com.
        </p>
      </form>
    </>
  );
}

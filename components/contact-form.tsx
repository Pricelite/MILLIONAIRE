import { Send } from "lucide-react";

const receiverEmail = "contact.studio.vcreation@gmail.com";

export function ContactForm() {
  return (
    <form
      className="contactForm"
      action={`https://formsubmit.co/${receiverEmail}`}
      method="POST"
    >
      <input
        type="hidden"
        name="_subject"
        value="Nouvelle demande depuis Studio V Creation"
      />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input
        type="hidden"
        name="_next"
        value="https://studiovcreation-chi-ochre.vercel.app/merci"
      />
      <input type="text" name="_honey" className="honeypot" tabIndex={-1} />

      <label>
        Nom
        <input
          name="Nom"
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
          name="Téléphone"
          type="tel"
          placeholder="07 84 14 97 13"
          autoComplete="tel"
          maxLength={30}
        />
      </label>

      <label>
        Message
        <textarea
          name="Message"
          rows={6}
          placeholder="Décrivez votre demande."
          minLength={10}
          maxLength={2000}
          required
        />
      </label>

      <button className="button primary" type="submit">
        Envoyer la demande
        <Send size={17} aria-hidden="true" />
      </button>

      <p className="formHelp">
        Votre demande sera envoyée à {receiverEmail}.
      </p>
    </form>
  );
}

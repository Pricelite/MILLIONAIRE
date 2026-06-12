import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Message envoyé | Studio V Creation",
  description:
    "Confirmation d’envoi du formulaire de contact Studio V Creation."
};

export default function MerciPage() {
  return (
    <main>
      <section className="pageHero thankYouHero">
        <div className="eyebrow">Message envoyé</div>
        <CheckCircle2 size={52} aria-hidden="true" />
        <h1>Votre demande a bien été envoyée.</h1>
        <p>
          Merci pour votre message. Studio V Creation vous répondra directement
          par e-mail dans les meilleurs délais.
        </p>
        <Link className="button primary" href="/">
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}

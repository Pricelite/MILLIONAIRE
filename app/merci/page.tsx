import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Message envoyé",
  description:
    "Confirmation d’envoi et de prise en charge du formulaire de contact Studio V Creation.",
  robots: {
    index: false,
    follow: false
  }
};

export default function MerciPage() {
  return (
    <main>
      <section className="pageHero thankYouHero">
        <div className="eyebrow">Message envoyé</div>
        <CheckCircle2 size={52} aria-hidden="true" />
        <h1>Merci, message reçu.</h1>
        <p>
          Studio V Creation vous répondra directement par e-mail dans les
          meilleurs délais.
        </p>
        <div className="virginieThankYouMessage">
          <Image
            src="/images/virginie-ia-avatar.webp"
            alt=""
            width={110}
            height={165}
          />
          <p>Votre demande est transmise à Virginie.</p>
        </div>
        <Link className="button primary" href="/">
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { company } from "@/lib/site-data";

export function QuoteCta() {
  return (
    <section className="quoteCta">
      <div>
        <p className="eyebrow">Demande de devis</p>
        <h2>{company.slogan}</h2>
        <p>
          Envoyez votre idée, vos couleurs, vos textes et votre délai. Vous
          recevez un support prêt à publier ou à transmettre à l’imprimeur.
        </p>
      </div>
      <Link href="/contact" className="button light">
        Préparer ma demande
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { company, legalInfo } from "@/lib/site-data";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata = createPageMetadata("confidentialite");

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site Studio V Creation et informations relatives au traitement des données personnelles.",
  url: `${siteUrl}/politique-de-confidentialite`,
  inLanguage: "fr-FR"
};

export default function PolitiqueDeConfidentialitePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            {
              name: "Politique de confidentialité",
              path: "/politique-de-confidentialite"
            }
          ]),
          privacyJsonLd
        ]}
      />

      <section className="pageHero">
        <p className="eyebrow">Données personnelles</p>
        <h1>Politique de confidentialité</h1>
        <p>
          Cette page explique quelles données peuvent être collectées sur le site
          {` ${company.name}`}, pourquoi elles sont utilisées et comment exercer
          vos droits.
        </p>
      </section>

      <section className="section legalPage">
        <SectionHeading
          eyebrow="RGPD"
          title="Une collecte limitée aux demandes de contact et de devis."
          text="Le site ne collecte que les informations nécessaires pour répondre aux messages envoyés via le formulaire de contact."
        />

        <div className="legalContent">
          <article>
            <h2>Responsable du traitement</h2>
            <p>
              Le responsable du traitement est {legalInfo.ownerName}, joignable
              par e-mail à <a href={`mailto:${legalInfo.email}`}>{legalInfo.email}</a>.
            </p>
          </article>

          <article>
            <h2>Données collectées</h2>
            <p>
              Lors de l’envoi du formulaire de contact, les données suivantes
              peuvent être collectées : nom, adresse e-mail, numéro de téléphone
              si renseigné, service souhaité et contenu du message.
            </p>
            <p>
              Des données techniques strictement nécessaires à la sécurité du
              formulaire peuvent également être utilisées de manière temporaire,
              notamment l’adresse IP ou des informations de requête, afin de
              limiter les abus automatisés.
            </p>
          </article>

          <article>
            <h2>Finalités</h2>
            <p>
              Les données sont utilisées pour répondre aux demandes
              d’information, préparer un devis, assurer le suivi de la relation
              commerciale et protéger le formulaire contre les envois abusifs.
            </p>
          </article>

          <article>
            <h2>Base légale</h2>
            <p>
              Le traitement repose sur l’intérêt légitime de {company.name} à
              répondre aux demandes reçues et, lorsque la demande porte sur un
              devis, sur l’exécution de mesures précontractuelles.
            </p>
          </article>

          <article>
            <h2>Destinataires</h2>
            <p>
              Les données sont destinées à {company.name}. Elles peuvent être
              transmises aux prestataires techniques nécessaires au fonctionnement
              du site et à l’envoi des e-mails, notamment l’hébergeur et le
              service d’envoi transactionnel.
            </p>
          </article>

          <article>
            <h2>Durée de conservation</h2>
            <p>
              Les messages de contact sont conservés pendant une durée
              proportionnée au traitement de la demande et au suivi commercial,
              sauf obligation légale ou demande de suppression applicable.
            </p>
          </article>

          <article>
            <h2>Cookies</h2>
            <p>
              Le site peut utiliser des cookies strictement nécessaires à son bon
              fonctionnement. Aucun cookie publicitaire ou de suivi non essentiel
              n’est prévu sans dispositif d’information et de consentement adapté.
            </p>
          </article>

          <article>
            <h2>Vos droits</h2>
            <p>
              Vous pouvez demander l’accès, la rectification, l’effacement ou la
              limitation du traitement de vos données en écrivant à
              <a href={`mailto:${legalInfo.email}`}> {legalInfo.email}</a>.
              Vous pouvez également introduire une réclamation auprès de la CNIL.
            </p>
            <Link href="/contact" className="button secondary">
              Contacter Studio V Creation
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { company, legalInfo } from "@/lib/site-data";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata = createPageMetadata("mentionsLegales");

const legalPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mentions légales",
  description:
    "Mentions légales du site Studio V Creation : éditeur, hébergeur, propriété intellectuelle, données personnelles et contact.",
  url: `${siteUrl}/mentions-legales`,
  inLanguage: "fr-FR"
};

export default function MentionsLegalesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Mentions légales", path: "/mentions-legales" }
          ]),
          legalPageJsonLd
        ]}
      />

      <section className="pageHero">
        <p className="eyebrow">Informations juridiques</p>
        <h1>Mentions légales</h1>
        <p>
          Cette page regroupe les informations obligatoires relatives à
          l’éditeur du site, à son hébergement, aux données personnelles et aux
          conditions d’utilisation du site vitrine {company.name}.
        </p>
      </section>

      <section className="section legalPage">
        <SectionHeading
          eyebrow="Informations légales"
          title="Informations d’identification"
          text="Les champs ci-dessous sont centralisés dans lib/site-data.ts pour rester faciles à modifier."
        />

        <div className="legalGrid">
          <article className="legalCard">
            <h2>Éditeur du site</h2>
            <dl>
              <div>
                <dt>Nom commercial</dt>
                <dd>{legalInfo.ownerName}</dd>
              </div>
              <div>
                <dt>Forme juridique</dt>
                <dd>{legalInfo.legalStatus}</dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>{legalInfo.address}</dd>
              </div>
              <div>
                <dt>Téléphone</dt>
                <dd>{legalInfo.phone}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${legalInfo.email}`}>{legalInfo.email}</a>
                </dd>
              </div>
              <div>
                <dt>Numéro SIRET</dt>
                <dd>{legalInfo.siret}</dd>
              </div>
            </dl>
          </article>

          <article className="legalCard">
            <h2>Direction de la publication</h2>
            <p>
              Le directeur ou la directrice de la publication est :
              <strong> {legalInfo.publicationDirector}</strong>.
            </p>
          </article>

          <article className="legalCard">
            <h2>Hébergement</h2>
            <dl>
              <div>
                <dt>Hébergeur</dt>
                <dd>{legalInfo.hostingProvider.name}</dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>{legalInfo.hostingProvider.address}</dd>
              </div>
              <div>
                <dt>Téléphone</dt>
                <dd>{legalInfo.hostingProvider.phone}</dd>
              </div>
              <div>
                <dt>Site web</dt>
                <dd>
                  <a href={legalInfo.hostingProvider.website}>
                    {legalInfo.hostingProvider.website}
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <div className="legalContent">
          <article>
            <h2>Objet du site</h2>
            <p>
              Le site {company.name} a pour objet de présenter les services de
              création de supports de communication prêts à l’emploi proposés
              aux commerçants, artisans, indépendants, associations et petites
              entreprises.
            </p>
            <p>
              Les informations présentes sur le site sont fournies à titre
              indicatif. Elles peuvent être modifiées à tout moment afin de
              refléter l’évolution de l’activité, des offres ou des tarifs.
            </p>
          </article>

          <article>
            <h2>Propriété intellectuelle</h2>
            <p>
              L’ensemble des contenus présents sur ce site, notamment les
              textes, visuels, éléments graphiques, logos, photographies,
              icônes, structure et mise en page, est protégé par le droit de la
              propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, adaptation,
              diffusion ou exploitation, totale ou partielle, sans autorisation
              écrite préalable de {company.name}, est interdite.
            </p>
          </article>

          <article>
            <h2>Responsabilité</h2>
            <p>
              {company.name} s’efforce d’assurer l’exactitude et la mise à jour
              des informations diffusées sur le site. Toutefois, des erreurs,
              omissions ou indisponibilités temporaires peuvent survenir.
            </p>
            <p>
              L’utilisateur reste seul responsable de l’utilisation qu’il fait
              des informations accessibles sur le site. Les liens externes
              éventuellement présents peuvent renvoyer vers des sites tiers sur
              lesquels {company.name} n’exerce aucun contrôle.
            </p>
          </article>

          <article>
            <h2>Données personnelles</h2>
            <p>
              Les données transmises via le formulaire de contact sont utilisées
              uniquement pour répondre aux demandes d’information ou de devis.
              Les données concernées peuvent inclure le nom, l’adresse e-mail,
              le type de besoin et le message saisi.
            </p>
            <p>
              Le traitement repose sur l’intérêt légitime de {company.name} à
              répondre aux demandes reçues et, le cas échéant, sur l’exécution
              de mesures précontractuelles lorsque la demande porte sur un
              devis.
            </p>
            <p>
              Les données sont destinées uniquement à {company.name} et aux
              prestataires techniques nécessaires au fonctionnement du site et à
              l’envoi des e-mails. Elles sont conservées pendant une durée
              proportionnée au traitement de la demande, sauf obligation légale
              ou relation commerciale ultérieure.
            </p>
            <p>
              Conformément à la réglementation applicable, toute personne
              concernée peut demander l’accès, la rectification, l’effacement ou
              la limitation du traitement de ses données en écrivant à
              <a href={`mailto:${legalInfo.email}`}> {legalInfo.email}</a>.
              Elle peut également introduire une réclamation auprès de la CNIL.
            </p>
          </article>

          <article>
            <h2>Cookies et mesure d’audience</h2>
            <p>
              Le site peut utiliser des cookies strictement nécessaires à son
              bon fonctionnement. Si des cookies de mesure d’audience, de
              publicité ou de suivi sont ajoutés ultérieurement, un dispositif
              d’information et de recueil du consentement devra être mis en
              place conformément aux règles applicables.
            </p>
          </article>

          <article>
            <h2>Contact</h2>
            <p>
              Pour toute question relative au site ou aux présentes mentions
              légales, vous pouvez contacter {company.name} par e-mail à
              <a href={`mailto:${legalInfo.email}`}> {legalInfo.email}</a>.
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


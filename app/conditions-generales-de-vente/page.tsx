import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { company, legalInfo, salesTermsInfo, services } from "@/lib/site-data";
import { JsonLd, breadcrumbJsonLd, createPageMetadata, siteUrl } from "@/lib/seo";

export const metadata = createPageMetadata("cgv");

const cgvJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Conditions Générales de Vente",
  description:
    "Conditions Générales de Vente applicables aux prestations de communication graphique proposées par Studio V. Création.",
  url: `${siteUrl}/conditions-generales-de-vente`,
  inLanguage: "fr-FR"
};

const serviceNames = services.map((service) => service.title);

export default function ConditionsGeneralesDeVentePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            {
              name: "Conditions Générales de Vente",
              path: "/conditions-generales-de-vente"
            }
          ]),
          cgvJsonLd
        ]}
      />

      <section className="pageHero">
        <p className="eyebrow">Cadre contractuel</p>
        <h1>Conditions Générales de Vente</h1>
        <p>
          Les présentes CGV encadrent les prestations de communication graphique
          proposées par {company.name}. Elles sont rédigées pour être faciles à
          adapter avant chaque mise en ligne ou évolution de l’offre.
        </p>
      </section>

      <section className="section legalPage">
        <SectionHeading
          eyebrow="Informations à vérifier"
          title="Zones modifiables avant publication"
          text="Les informations commerciales principales sont centralisées dans lib/site-data.ts."
        />

        <div className="legalGrid">
          <article className="legalCard">
            <h2>Prestataire</h2>
            <dl>
              <div>
                <dt>Nom</dt>
                <dd>{legalInfo.ownerName}</dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>{legalInfo.address}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${legalInfo.email}`}>{legalInfo.email}</a>
                </dd>
              </div>
              <div>
                <dt>SIRET</dt>
                <dd>{legalInfo.siret}</dd>
              </div>
            </dl>
          </article>

          <article className="legalCard">
            <h2>Commande</h2>
            <dl>
              <div>
                <dt>Validité des devis</dt>
                <dd>{salesTermsInfo.quoteValidityDays} jours</dd>
              </div>
              <div>
                <dt>Acompte conseillé</dt>
                <dd>{salesTermsInfo.depositRate}</dd>
              </div>
              <div>
                <dt>Révisions incluses</dt>
                <dd>{salesTermsInfo.includedRevisionRounds} séries</dd>
              </div>
              <div>
                <dt>Mise à jour</dt>
                <dd>{salesTermsInfo.versionDate}</dd>
              </div>
            </dl>
          </article>

          <article className="legalCard">
            <h2>Livraison</h2>
            <p>{salesTermsInfo.deliveryMethod}.</p>
            <p>{salesTermsInfo.fileFormats}.</p>
          </article>
        </div>

        <div className="legalContent">
          <article>
            <h2>Article 1 - Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente définissent les droits
              et obligations de {company.name} et de ses clients dans le cadre
              de la vente de prestations de communication graphique.
            </p>
            <p>
              Toute commande implique l’acceptation pleine et entière des
              présentes CGV, sauf conditions particulières acceptées par écrit
              par {company.name}.
            </p>
          </article>

          <article>
            <h2>Article 2 - Prestations concernées</h2>
            <p>
              Les CGV s’appliquent notamment aux prestations suivantes :
              {serviceNames.map((serviceName) => (
                <span className="inlineListItem" key={serviceName}>
                  {serviceName}
                </span>
              ))}
            </p>
            <p>
              Des prestations complémentaires peuvent être proposées sur devis
              selon les besoins du client, notamment déclinaisons de visuels,
              grilles tarifaires, calendriers éditoriaux ou supports
              événementiels.
            </p>
          </article>

          <article>
            <h2>Article 3 - Commande</h2>
            <p>
              La commande est établie sur la base des informations transmises
              par le client : type de support, objectif, textes, images,
              dimensions, formats souhaités, charte graphique éventuelle, délais
              et contraintes de diffusion.
            </p>
            <p>
              Un devis ou récapitulatif de commande précise la nature de la
              prestation, le prix, les délais estimatifs, les éléments attendus
              et les conditions particulières éventuelles. Le devis est valable
              pendant {salesTermsInfo.quoteValidityDays} jours à compter de sa
              date d’émission.
            </p>
            <p>
              La commande devient ferme après acceptation écrite du devis ou du
              récapitulatif et, le cas échéant, après réception de l’acompte
              demandé.
            </p>
          </article>

          <article>
            <h2>Article 4 - Prix et paiement</h2>
            <p>
              Les prix applicables sont ceux communiqués sur le site, dans le
              devis ou dans le récapitulatif de commande. Les tarifs peuvent
              évoluer à tout moment, mais une commande validée reste facturée
              selon le tarif accepté au moment de la commande.
            </p>
            <p>
              Sauf mention contraire, un acompte de {salesTermsInfo.depositRate}
              peut être demandé à la validation de la commande. Le solde est dû
              {salesTermsInfo.balancePaymentMoment}.
            </p>
            <p>
              Les prestations sont livrées uniquement après règlement des sommes
              exigibles. Tout retard de paiement peut suspendre la réalisation
              ou la livraison de la commande.
            </p>
            <p>
              Les éventuels frais d’impression, d’achat de licences, de banques
              d’images, de typographies, de publicité ou de services tiers ne
              sont pas inclus sauf mention écrite contraire.
            </p>
          </article>

          <article>
            <h2>Article 5 - Délais de réalisation</h2>
            <p>
              Les délais annoncés sont indicatifs et commencent à courir après
              validation de la commande, réception de l’acompte éventuel et
              transmission complète des éléments nécessaires par le client.
            </p>
            <p>
              Tout retard dans la transmission des contenus, validations ou
              informations demandées peut entraîner un report du délai de
              livraison sans que la responsabilité de {company.name} puisse être
              engagée.
            </p>
            <p>
              En cas de contrainte urgente, un délai prioritaire peut être
              accepté selon disponibilité et faire l’objet d’une tarification
              spécifique.
            </p>
          </article>

          <article>
            <h2>Article 6 - Obligations du client</h2>
            <p>
              Le client s’engage à fournir des informations exactes, complètes
              et exploitables. Il garantit disposer des droits nécessaires sur
              les textes, images, logos, marques, photographies ou tout autre
              élément transmis à {company.name}.
            </p>
            <p>
              Le client reste responsable de la vérification finale des textes,
              prix, dates, coordonnées, mentions promotionnelles, informations
              légales et contenus figurant sur les supports avant publication,
              impression ou diffusion.
            </p>
          </article>

          <article>
            <h2>Article 7 - Modifications et corrections</h2>
            <p>
              La prestation comprend {salesTermsInfo.includedRevisionRounds}
              séries de modifications raisonnables, sauf indication contraire
              dans le devis. Les modifications doivent rester cohérentes avec le
              brief initial validé.
            </p>
            <p>
              Une modification importante du brief, un changement complet de
              direction graphique, l’ajout de nouveaux supports ou toute demande
              hors périmètre peut entraîner un devis complémentaire.
            </p>
            <p>{salesTermsInfo.extraRevisionBilling}</p>
          </article>

          <article>
            <h2>Article 8 - Annulation de commande</h2>
            <p>{salesTermsInfo.cancellationBeforeStart}</p>
            <p>{salesTermsInfo.cancellationAfterStart}</p>
            <p>
              En cas d’annulation par {company.name} pour indisponibilité,
              impossibilité technique ou motif légitime, les sommes versées pour
              les prestations non réalisées sont remboursées.
            </p>
          </article>

          <article>
            <h2>Article 9 - Droit de rétractation</h2>
            <p>
              Lorsque le client est un consommateur au sens du Code de la
              consommation et que la commande est conclue à distance, il peut
              bénéficier d’un délai légal de rétractation, sauf exception
              applicable.
            </p>
            <p>
              Si le client demande expressément le démarrage de la prestation
              avant la fin du délai légal de rétractation, il reconnaît que les
              sommes correspondant au travail déjà réalisé pourront rester dues.
              Lorsque la prestation est pleinement exécutée avant la fin du
              délai avec l’accord préalable du client, le droit de rétractation
              peut ne plus s’appliquer conformément aux règles en vigueur.
            </p>
            <p>
              Les créations personnalisées réalisées selon les spécifications du
              client peuvent également relever d’exceptions au droit de
              rétractation. Chaque situation doit être appréciée selon la nature
              exacte de la commande.
            </p>
          </article>

          <article>
            <h2>Article 10 - Livraison numérique</h2>
            <p>
              La livraison est effectuée sous forme numérique par
              {salesTermsInfo.deliveryMethod}. Les fichiers sont fournis dans
              les formats convenus : {salesTermsInfo.fileFormats}.
            </p>
            <p>
              Sauf accord contraire, les fichiers sources modifiables ne sont
              pas inclus dans la prestation. Leur transmission peut faire
              l’objet d’un accord spécifique et d’une facturation
              complémentaire.
            </p>
            <p>
              Le client est responsable de la sauvegarde des fichiers livrés.
              {company.name} ne garantit pas la conservation indéfinie des
              fichiers après livraison.
            </p>
          </article>

          <article>
            <h2>Article 11 - Validation finale</h2>
            <p>
              Avant toute publication ou impression, le client doit vérifier et
              valider l’ensemble des éléments livrés. La validation finale vaut
              acceptation du support livré.
            </p>
            <p>
              Après validation, toute correction liée à une erreur non signalée
              par le client, notamment faute de texte, prix, date, horaire,
              numéro, adresse ou information commerciale, peut être facturée en
              supplément.
            </p>
          </article>

          <article>
            <h2>Article 12 - Propriété intellectuelle</h2>
            <p>
              Les créations réalisées par {company.name} restent protégées par
              le droit d’auteur. Sauf mention contraire, le règlement complet de
              la commande entraîne la cession au client d’un droit d’utilisation
              des créations livrées pour ses besoins de communication.
            </p>
            <p>
              Cette cession est limitée aux supports, formats, territoires et
              usages prévus dans la commande. Toute revente, modification
              substantielle, reproduction étendue, dépôt de marque, utilisation
              sur des supports non prévus ou exploitation par un tiers nécessite
              un accord écrit préalable.
            </p>
            <p>
              Les éléments fournis par le client demeurent sa propriété ou celle
              de leurs titulaires respectifs. Le client garantit {company.name}
              contre toute réclamation liée à l’utilisation des éléments qu’il
              fournit.
            </p>
          </article>

          <article>
            <h2>Article 13 - Références et portfolio</h2>
            <p>
              Sauf refus écrit du client, {company.name} peut présenter les
              créations réalisées dans son portfolio, sur son site internet, ses
              réseaux sociaux ou ses supports de communication, à titre de
              référence commerciale.
            </p>
            <p>
              Le client peut demander la confidentialité d’un projet avant sa
              publication ou pour un motif légitime.
            </p>
          </article>

          <article>
            <h2>Article 14 - Responsabilité</h2>
            <p>
              {company.name} est tenue à une obligation de moyens dans la
              réalisation des prestations. Sa responsabilité ne peut être
              engagée en cas de mauvaise utilisation des fichiers, modification
              par un tiers, défaut d’impression par un imprimeur, erreur dans les
              informations validées par le client ou utilisation non conforme
              aux recommandations.
            </p>
            <p>
              {company.name} ne garantit pas un résultat commercial déterminé,
              tel qu’un nombre de ventes, de vues, d’abonnés, de réservations ou
              de demandes client générées par les supports créés.
            </p>
            <p>
              En tout état de cause, la responsabilité de {company.name} est
              limitée au montant effectivement payé par le client pour la
              prestation concernée.
            </p>
          </article>

          <article>
            <h2>Article 15 - Force majeure</h2>
            <p>
              Aucune partie ne pourra être tenue responsable d’un retard ou
              d’une inexécution résultant d’un événement imprévisible,
              irrésistible et extérieur au sens du droit français, notamment
              panne majeure, incident technique, maladie, catastrophe naturelle,
              interruption de service ou événement indépendant de la volonté des
              parties.
            </p>
          </article>

          <article>
            <h2>Article 16 - Données personnelles</h2>
            <p>
              Les données collectées lors d’une demande de devis ou d’une
              commande sont utilisées pour traiter la demande, établir le devis,
              réaliser la prestation, assurer le suivi client et respecter les
              obligations administratives ou comptables applicables.
            </p>
            <p>
              Le client peut exercer ses droits d’accès, de rectification,
              d’effacement ou de limitation en écrivant à
              <a href={`mailto:${legalInfo.email}`}> {legalInfo.email}</a>.
            </p>
          </article>

          <article>
            <h2>Article 17 - Réclamation et règlement amiable</h2>
            <p>
              En cas de difficulté, le client est invité à contacter
              {company.name} afin de rechercher une solution amiable. Toute
              réclamation doit être formulée par écrit, avec les éléments
              permettant d’identifier la commande concernée.
            </p>
          </article>

          <article>
            <h2>Article 18 - Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes CGV sont soumises au {salesTermsInfo.governingLaw}.
              En cas de litige et à défaut de résolution amiable, les tribunaux
              français compétents pourront être saisis conformément aux règles
              de procédure applicables.
            </p>
          </article>

          <article>
            <h2>Contact</h2>
            <p>
              Pour toute question relative aux présentes CGV, le client peut
              contacter {company.name} à l’adresse suivante :
              <a href={`mailto:${legalInfo.email}`}> {legalInfo.email}</a>.
            </p>
            <Link href="/contact" className="button secondary">
              Demander un devis
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}

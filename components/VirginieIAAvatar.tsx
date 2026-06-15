"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Send, X } from "lucide-react";

type Message = {
  id: number;
  role: "assistant" | "visitor";
  content: string;
};

type QuoteStep = "idle" | "prenom" | "activite" | "projet" | "delai" | "budget" | "email" | "done";

type QuoteData = {
  prenom?: string;
  activite?: string;
  projet?: string;
  delai?: string;
  budget?: string;
  email?: string;
};

const welcomeMessage =
  "Bonjour 👋 Je suis Virginie IA, l’assistante virtuelle de Studio V Creation. Je peux vous guider, répondre à vos questions et vous aider à préparer votre demande de devis.";

const complexRequestAnswer =
  "Cette demande mérite une étude personnalisée. Je vous invite à transmettre votre demande via le formulaire de contact afin que Virginie puisse vous répondre directement.";

const stepQuestions: Record<Exclude<QuoteStep, "idle" | "done">, string> = {
  prenom: "Avec plaisir. Pour commencer, quel est votre prénom ?",
  activite: "Merci. Quelle est votre activité ou le nom de votre structure ?",
  projet: "Quel type de projet souhaitez-vous préparer : logo, flyer, carte de visite, visuels réseaux sociaux, supports imprimés… ?",
  delai: "Pour quel délai souhaitez-vous idéalement recevoir vos supports ?",
  budget: "Avez-vous un budget approximatif à respecter ? Même une fourchette suffit.",
  email: "Parfait. Quel email Virginie peut-elle utiliser pour vous répondre ?"
};

function getNextStep(step: QuoteStep): QuoteStep {
  if (step === "prenom") return "activite";
  if (step === "activite") return "projet";
  if (step === "projet") return "delai";
  if (step === "delai") return "budget";
  if (step === "budget") return "email";
  return "done";
}

function isQuoteQuestionStep(
  step: QuoteStep
): step is Exclude<QuoteStep, "idle" | "done"> {
  return step !== "idle" && step !== "done";
}

function getQuoteSummary(data: QuoteData) {
  return [
    "Votre demande est prête à être transmise :",
    data.prenom ? `• Prénom : ${data.prenom}` : null,
    data.activite ? `• Activité : ${data.activite}` : null,
    data.projet ? `• Projet : ${data.projet}` : null,
    data.delai ? `• Délai souhaité : ${data.delai}` : null,
    data.budget ? `• Budget indicatif : ${data.budget}` : null,
    data.email ? `• Email : ${data.email}` : null,
    "",
    "Vous pouvez copier ces éléments dans le formulaire de contact afin que Virginie puisse vous répondre rapidement."
  ]
    .filter(Boolean)
    .join("\n");
}

function getAssistantAnswer(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("complexe") ||
    normalized.includes("contrat") ||
    normalized.includes("juridique") ||
    normalized.includes("confidentiel") ||
    normalized.includes("partenariat")
  ) {
    return complexRequestAnswer;
  }

  if (
    normalized.includes("service") ||
    normalized.includes("prestation") ||
    normalized.includes("logo") ||
    normalized.includes("flyer") ||
    normalized.includes("affiche") ||
    normalized.includes("carte") ||
    normalized.includes("réseau") ||
    normalized.includes("reseau") ||
    normalized.includes("identité") ||
    normalized.includes("identite")
  ) {
    return "Studio V Creation accompagne les entrepreneurs, artisans, indépendants, associations et petites entreprises sur leurs logos, identités visuelles, cartes de visite, flyers, affiches, supports imprimés et visuels réseaux sociaux.";
  }

  if (
    normalized.includes("prix") ||
    normalized.includes("tarif") ||
    normalized.includes("budget") ||
    normalized.includes("combien")
  ) {
    return "Les tarifs dépendent du support, du volume et du niveau de création attendu. Le plus fiable est de préparer une demande de devis avec quelques informations clés.";
  }

  if (
    normalized.includes("délai") ||
    normalized.includes("delai") ||
    normalized.includes("urgent") ||
    normalized.includes("quand")
  ) {
    return "Les délais varient selon le type de support et la disponibilité du planning. Indiquez votre échéance souhaitée dans votre demande pour obtenir une réponse précise.";
  }

  if (
    normalized.includes("contact") ||
    normalized.includes("email") ||
    normalized.includes("devis") ||
    normalized.includes("rendez")
  ) {
    return "Je peux vous aider à préparer votre demande de devis ici, puis vous pourrez l’envoyer via le formulaire de contact du site.";
  }

  if (
    normalized.includes("bonjour") ||
    normalized.includes("salut") ||
    normalized.includes("hello") ||
    normalized.includes("bonsoir")
  ) {
    return "Bonjour 👋 Comment puis-je vous aider pour votre communication visuelle aujourd’hui ?";
  }

  return "Je peux vous aider sur les prestations de Studio V Creation, la préparation d’un devis ou les questions liées à votre communication visuelle.";
}

export function VirginieIAAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [quoteStep, setQuoteStep] = useState<QuoteStep>("idle");
  const [quoteData, setQuoteData] = useState<QuoteData>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: welcomeMessage
    }
  ]);

  const hasCompletedQuote = quoteStep === "done";

  const contactHref = useMemo(() => {
    const body = getQuoteSummary(quoteData);
    return `/contact?message=${encodeURIComponent(body)}`;
  }, [quoteData]);

  function addMessage(role: Message["role"], content: string) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now() + currentMessages.length,
        role,
        content
      }
    ]);
  }

  function startQuoteFlow() {
    setIsOpen(true);
    setQuoteStep("prenom");
    addMessage("assistant", stepQuestions.prenom);
  }

  function handleQuoteAnswer(
    answer: string,
    currentStep: Exclude<QuoteStep, "idle" | "done">
  ) {
    const dataKey = currentStep;
    const nextStep = getNextStep(currentStep);

    setQuoteData((currentData) => ({
      ...currentData,
      [dataKey]: answer
    }));

    if (nextStep === "done") {
      const finalData = {
        ...quoteData,
        [dataKey]: answer
      };
      setQuoteStep("done");
      addMessage(
        "assistant",
        `${getQuoteSummary(finalData)}\n\nSouhaitez-vous que je vous aide à préparer votre demande de devis afin que Virginie puisse vous répondre rapidement ?`
      );
      return;
    }

    if (isQuoteQuestionStep(nextStep)) {
      setQuoteStep(nextStep);
      addMessage("assistant", stepQuestions[nextStep]);
    }
  }

  function handleVisitorMessage(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    addMessage("visitor", trimmedValue);
    setInput("");

    if (isQuoteQuestionStep(quoteStep)) {
      handleQuoteAnswer(trimmedValue, quoteStep);
      return;
    }

    if (
      trimmedValue.toLowerCase().includes("devis") ||
      trimmedValue.toLowerCase().includes("projet")
    ) {
      startQuoteFlow();
      return;
    }

    addMessage("assistant", getAssistantAnswer(trimmedValue));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleVisitorMessage(input);
  }

  return (
    <aside className="virginieIA" aria-live="polite">
      {isOpen ? (
        <section className="virginieIAPanel" role="dialog" aria-label="Chat Virginie IA">
          <header className="virginieIAHeader">
            <div>
              <p>Virginie IA</p>
              <span>Assistante virtuelle</span>
            </div>
            <button
              type="button"
              className="virginieIAClose"
              aria-label="Fermer le chat Virginie IA"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="virginieIAMessages">
            {messages.map((message) => (
              <div
                className={`virginieIAMessage ${message.role === "visitor" ? "visitor" : "assistant"}`}
                key={message.id}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="virginieIAActions" aria-label="Actions rapides Virginie IA">
            <Link href="/services">Voir les prestations</Link>
            <button type="button" onClick={startQuoteFlow}>
              Demander un devis
            </button>
            <Link href="/portfolio">Voir le portfolio</Link>
            <Link href="/contact">Contacter Virginie</Link>
          </div>

          {hasCompletedQuote ? (
            <Link className="virginieIAContact" href={contactHref}>
              Ouvrir le formulaire de contact
            </Link>
          ) : null}

          <form className="virginieIAForm" onSubmit={handleSubmit}>
            <label htmlFor="virginie-ia-message">Votre message</label>
            <input
              id="virginie-ia-message"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Écrivez votre question..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Envoyer le message">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="virginieIAAvatarButton"
        aria-label={isOpen ? "Fermer Virginie IA" : "Ouvrir Virginie IA"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="virginieIASpeech">Bonjour, comment puis-je vous aider ?</span>
        <Image
          src="/images/virginie-ia-avatar.webp"
          alt="Virginie IA, assistante virtuelle de Studio V Creation"
          width={595}
          height={1425}
          className="virginieIAAvatarImage"
          priority={false}
        />
      </button>
    </aside>
  );
}

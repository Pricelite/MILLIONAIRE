"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

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

const greeting =
  "Bonjour 👋\n\nJe suis Virginie IA, l'assistante virtuelle de Studio V Creation.\n\nJe peux vous renseigner sur les prestations, vous aider à préparer une demande de devis ou répondre à vos questions.\n\nComment puis-je vous aider aujourd'hui ?";

const complexRequestAnswer =
  "Cette demande mérite une étude personnalisée. Je vous invite à transmettre votre demande via le formulaire de contact afin que Virginie puisse vous répondre directement.";

const quickActions = [
  "Voir les prestations",
  "Préparer un devis",
  "Délais de création",
  "Contacter Virginie"
];

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
    "Vous pouvez maintenant copier ces éléments dans le formulaire de contact afin que Virginie puisse vous répondre rapidement."
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
    return "Studio V Creation peut vous accompagner sur la création de logo, l’identité visuelle, les cartes de visite, flyers, affiches, supports imprimés, visuels réseaux sociaux, contenus visuels, supports marketing et conseils en image de marque.";
  }

  if (
    normalized.includes("prix") ||
    normalized.includes("tarif") ||
    normalized.includes("budget") ||
    normalized.includes("combien")
  ) {
    return "Les tarifs dépendent du support, du volume et du niveau de création attendu. Le plus fiable est de préparer une demande de devis avec quelques informations clés, sans annoncer de prix non confirmé.";
  }

  if (
    normalized.includes("délai") ||
    normalized.includes("delai") ||
    normalized.includes("urgent") ||
    normalized.includes("quand")
  ) {
    return "Les délais varient selon le type de support et la disponibilité du planning. Indiquez votre échéance souhaitée dans votre demande afin que Virginie puisse vous répondre précisément.";
  }

  if (
    normalized.includes("contact") ||
    normalized.includes("email") ||
    normalized.includes("devis") ||
    normalized.includes("rendez")
  ) {
    return "Je peux vous aider à structurer votre demande de devis ici, puis vous pourrez l’envoyer via le formulaire de contact du site.";
  }

  if (
    normalized.includes("bonjour") ||
    normalized.includes("salut") ||
    normalized.includes("hello") ||
    normalized.includes("bonsoir")
  ) {
    return "Bonjour 👋 Comment puis-je vous aider pour votre communication visuelle aujourd’hui ?";
  }

  return "Je peux vous aider sur les prestations de Studio V Creation, la préparation d’un devis ou les questions liées à votre communication visuelle. Pour un autre sujet, je préfère vous orienter vers le formulaire de contact.";
}

export function VirginieIaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [quoteStep, setQuoteStep] = useState<QuoteStep>("idle");
  const [quoteData, setQuoteData] = useState<QuoteData>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: greeting
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

    addMessage(
      "assistant",
      `${getAssistantAnswer(trimmedValue)}\n\nSouhaitez-vous que je vous aide à préparer votre demande de devis afin que Virginie puisse vous répondre rapidement ?`
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleVisitorMessage(input);
  }

  return (
    <div className="virginieChat" aria-live="polite">
      {isOpen ? (
        <section className="virginiePanel" role="dialog" aria-label="Virginie IA">
          <header className="virginieHeader">
            <div className="virginieIdentity">
              <Image
                src="/images/virginie-ia.webp"
                alt=""
                width={64}
                height={96}
                className="virginieAvatar"
              />
              <div>
                <p>Virginie IA</p>
                <span>Assistante Studio V Creation</span>
              </div>
            </div>
            <button
              type="button"
              className="virginieClose"
              aria-label="Fermer Virginie IA"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="virginieMessages">
            {messages.map((message) => (
              <div
                className={`virginieMessage ${message.role === "visitor" ? "visitor" : "assistant"}`}
                key={message.id}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="virginieQuickActions" aria-label="Actions rapides">
            {quickActions.map((action) => (
              <button
                type="button"
                key={action}
                onClick={() =>
                  action === "Préparer un devis"
                    ? startQuoteFlow()
                    : handleVisitorMessage(action)
                }
              >
                {action}
              </button>
            ))}
          </div>

          {hasCompletedQuote ? (
            <Link className="virginieContactLink" href={contactHref}>
              Ouvrir le formulaire de contact
            </Link>
          ) : null}

          <form className="virginieForm" onSubmit={handleSubmit}>
            <label htmlFor="virginie-message">Votre message</label>
            <input
              id="virginie-message"
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
        className="virginieLauncher"
        aria-label="Ouvrir Virginie IA"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <Image
          src="/images/virginie-ia.webp"
          alt=""
          width={76}
          height={114}
          className="virginieLauncherAvatar"
        />
        <span>
          <MessageCircle size={18} aria-hidden="true" />
          Virginie IA
        </span>
        <Bot size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

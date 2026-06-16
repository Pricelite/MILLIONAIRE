import Image from "next/image";
import {
  BadgeCheck,
  FileText,
  Gift,
  Lightbulb,
  Mail,
  MessageCircle,
  Palette,
  SearchCheck
} from "lucide-react";

const projectSteps = [
  {
    icon: MessageCircle,
    title: "Découverte du besoin"
  },
  {
    icon: SearchCheck,
    title: "Analyse & Conseils"
  },
  {
    icon: Lightbulb,
    title: "Solution personnalisée"
  },
  {
    icon: FileText,
    title: "Demande de devis"
  },
  {
    icon: Mail,
    title: "Transmission du projet"
  },
  {
    icon: BadgeCheck,
    title: "Étude & Validation"
  },
  {
    icon: Palette,
    title: "Création graphique"
  },
  {
    icon: Gift,
    title: "Livraison & Accompagnement"
  }
];

export function ProjectInfographic() {
  return (
    <section className="projectInfographicSection" aria-labelledby="project-infographic-title">
      <div className="projectInfographicHeader">
        <p className="eyebrow">Accompagnement</p>
        <h2 id="project-infographic-title">Votre projet avec Studio V Creation</h2>
      </div>

      <div className="projectInfographicCanvas" data-export="web">
        <div className="projectInfographicRing" aria-hidden="true" />
        <div className="projectInfographicArrow arrowOne" aria-hidden="true" />
        <div className="projectInfographicArrow arrowTwo" aria-hidden="true" />
        <div className="projectInfographicArrow arrowThree" aria-hidden="true" />
        <div className="projectInfographicArrow arrowFour" aria-hidden="true" />

        <div className="projectInfographicCenter">
          <div className="projectAvatarHalo">
            <Image
              src="/images/virginie-ia-infographic.png"
              alt="Virginie IA, assistante virtuelle de Studio V Creation"
              width={1024}
              height={1536}
              className="projectAvatarImage"
              sizes="(max-width: 640px) 130px, 190px"
            />
          </div>
          <p>Virginie IA</p>
          <span>Assistante virtuelle</span>
        </div>

        <ol className="projectInfographicSteps" aria-label="Étapes du projet">
          {projectSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li className={`projectStep step${index + 1}`} key={step.title}>
                <div className="projectStepMarker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="projectStepIcon">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3>{step.title}</h3>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="projectInfographicCaption">
        Virginie IA vous accompagne à chaque étape afin de simplifier votre
        projet et vous orienter vers la meilleure solution.
      </p>

      <div className="projectInfographicSquare" aria-hidden="true">
        <div className="projectInfographicSquareInner">
          <ProjectInfographicMini />
        </div>
      </div>
    </section>
  );
}

function ProjectInfographicMini() {
  return (
    <>
      <p className="projectMiniTitle">Votre projet avec Studio V Creation</p>
      <div className="projectMiniCenter">
        <Image
          src="/images/virginie-ia-infographic.png"
          alt=""
          width={1024}
          height={1536}
          className="projectMiniAvatar"
          sizes="190px"
        />
      </div>
      <div className="projectMiniSteps">
        {projectSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div className="projectMiniStep" key={step.title}>
              <Icon size={20} aria-hidden="true" />
              <span>{index + 1}</span>
              <p>{step.title}</p>
            </div>
          );
        })}
      </div>
      <p className="projectMiniCaption">
        Virginie IA vous accompagne à chaque étape afin de simplifier votre projet.
      </p>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { company } from "@/lib/site-data";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="siteHeader">
      <Link href="/" className="brandMark" aria-label={company.name}>
        <span>Studio V.</span>
        <strong>Création</strong>
      </Link>

      {/* Navigation principale visible sur desktop et compacte sur mobile. */}
      <nav className="mainNav" aria-label="Navigation principale">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href="/contact" className="headerCta">
        Demande de devis
      </Link>

      <button
        className="menuButton"
        aria-label="Menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Menu size={21} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="mobileNav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}

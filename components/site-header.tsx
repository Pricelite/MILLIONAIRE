"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
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
        <span>Studio V</span>
        <strong>Creation</strong>
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

      <AnimatePresence>
        {isOpen ? (
          <m.div
            className="mobileNav"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {navigation.map((item, index) => (
              <m.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035 }}
              >
                <Link href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              </m.div>
            ))}
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}


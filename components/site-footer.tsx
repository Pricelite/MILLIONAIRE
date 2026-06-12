import Link from "next/link";
import { Facebook, Instagram, Mail, Music2 } from "lucide-react";
import { company } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <Link href="/" className="brandMark footerBrand" aria-label={company.name}>
          <span>Studio V.</span>
          <strong>Création</strong>
        </Link>
        <p>{company.description}</p>
      </div>

      <div className="footerLinks">
        <Link href="/services">Services</Link>
        <Link href="/tarifs">Tarifs</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
      </div>

      <div className="socialLinks" aria-label="Réseaux sociaux">
        <a href={`mailto:${company.email}`} aria-label="Email">
          <Mail size={18} aria-hidden="true" />
        </a>
        <a href={company.instagram} aria-label="Instagram">
          <Instagram size={18} aria-hidden="true" />
        </a>
        <a href={company.facebook} aria-label="Facebook">
          <Facebook size={18} aria-hidden="true" />
        </a>
        <a href={company.tiktok} aria-label="TikTok">
          <Music2 size={18} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

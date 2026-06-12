"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";

type MotionBlockProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

type RevealSectionProps = MotionBlockProps & {
  id?: string;
  "aria-label"?: string;
};

type MotionLinkProps = MotionBlockProps & {
  href: string;
  ariaLabel?: string;
};

const revealVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 }
};

const heroVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06
    }
  }
};

export function Reveal({ children, className, delay = 0 }: MotionBlockProps) {
  return (
    <m.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

export function RevealSection({
  children,
  className,
  delay = 0,
  ...props
}: RevealSectionProps) {
  return (
    <m.section
      className={className}
      {...props}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay }}
    >
      {children}
    </m.section>
  );
}

export function HeroReveal({ children, className, delay = 0 }: MotionBlockProps) {
  return (
    <m.div
      className={className}
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.75 }}
    >
      {children}
    </m.div>
  );
}

export function StaggerGroup({ children, className }: MotionBlockProps) {
  return (
    <m.div
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      {children}
    </m.div>
  );
}

export function MotionCard({ children, className }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.article
      className={className}
      variants={revealVariants}
      whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {children}
    </m.article>
  );
}

export function MotionDetails({ children, className }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.details
      className={className}
      variants={revealVariants}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      {children}
    </m.details>
  );
}

export function MotionButtonLink({
  children,
  className,
  href,
  ariaLabel
}: MotionLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className="motionButtonWrap"
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    </m.div>
  );
}


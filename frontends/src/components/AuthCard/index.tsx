import type { PropsWithChildren, ReactNode } from "react";
import styles from "./AuthCard.module.css";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export default function AuthCard({ title, subtitle, footer, children }: PropsWithChildren<AuthCardProps>) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>
      {children}
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}

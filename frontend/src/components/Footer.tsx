import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 pb-24 md:pb-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-heading text-lg font-bold tracking-luxury uppercase">Montclair</span>
        <nav className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Boutiques', 'Service'].map((l) => (
            <Link key={l} to="#" className="text-xs tracking-luxury uppercase text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground tracking-wide">
          © 2024 Montclair Horology. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

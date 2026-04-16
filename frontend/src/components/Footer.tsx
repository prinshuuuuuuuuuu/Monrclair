import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, Globe } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

// ─── Icon Components ────────────────────────────────────────────────────────

const SvgIcon = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </SvgIcon>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </SvgIcon>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </SvgIcon>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </SvgIcon>
);

// ─── Static Data ─────────────────────────────────────────────────────────────

const SOCIALS = [
  { Icon: InstagramIcon, label: "Instagram" },
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: TwitterIcon, label: "Twitter" },
  { Icon: YoutubeIcon, label: "YouTube" },
] as const;

const NAV_COLUMNS = [
  {
    heading: "Shop",
    links: ["New Arrivals", "Women", "Men", "Accessories", "Collections", "Sale"],
  },
  {
    heading: "Help & Support",
    links: [
      "Contact Us",
      "Shipping & Delivery",
      "Returns & Exchanges",
      "Track Your Order",
      "Size Guide",
      "FAQs",
    ],
  },
  {
    heading: "Company",
    links: [
      "Our Story",
      "Sustainability",
      "Ethics & Compliance",
      "Careers",
      "Privacy Policy",
      "Terms of Service",
    ],
  },
] as const;

const CONTACT_INFO = [
  {
    Icon: MapPin,
    text: (
      <>
        123 Luxury Avenue,
        <br />
        Fashion District, NY 10001
      </>
    ),
  },
  { Icon: Phone, text: "+1 (555) 000-1234" },
  { Icon: Mail, text: "concierge@monrclair.com" },
] as const;

const PAYMENT_METHODS = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    alt: "Visa",
    className: "h-4",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    alt: "Mastercard",
    className: "h-6",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    alt: "PayPal",
    className: "h-4",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg",
    alt: "Apple Pay",
    className: "h-6",
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavColumn({ heading, links }: { heading: string; links: readonly string[] }) {
  return (
    <div>
      <h4 className="text-xs font-heading font-semibold uppercase tracking-widest mb-6 text-foreground/50">
        {heading}
      </h4>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item}>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-200"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
function BrandColumn() {
  return (
    <div className="space-y-6">
      <Link to="/" className="inline-block">
        <span className="text-2xl font-heading tracking-widest text-primary uppercase">
          {APP_CONFIG.APP_NAME}
        </span>
      </Link>

      <ul className="space-y-4">
        {CONTACT_INFO.map(({ Icon, text }, i) => (
          <li key={i} className="flex items-start gap-3 group cursor-pointer">
            <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
              {text}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 pt-1">
        {SOCIALS.map(({ Icon, label }) => (
          <a
            key={label}
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300 group"
            aria-label={label}
          >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </a>
        ))}
      </div>
    </div>
  );
}

function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <p className="text-xs text-muted-foreground font-body">
          &copy; {currentYear} {APP_CONFIG.APP_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="w-3 h-3" />
          <span>United States / English (USD)</span>
        </div>
      </div>

      <div className="flex items-center gap-4 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
        {PAYMENT_METHODS.map(({ src, alt, className }) => (
          <img key={alt} src={src} alt={alt} className={className} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-24 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">
       

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <BrandColumn />
          {NAV_COLUMNS.map((col) => (
            <NavColumn key={col.heading} {...col} />
          ))}
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
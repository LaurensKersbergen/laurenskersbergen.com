import { socials } from "@/lib/site";
import { ToTop } from "@/components/to-top";

/**
 * The foot of every page: the places to find Laurens in large type, where the
 * site is made, and the copyright with a way back up.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="shell" data-reveal>
      <div className="site-footer border-t border-(--border)">
        <div className="footer-links">
          <nav aria-label="Elsewhere" className="footer-social">
            {socials.map((social) => (
              <a key={social.label} href={social.href} {...(social.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
                {social.label}
              </a>
            ))}
          </nav>
          <div className="footer-place">
            <span>Made in Amsterdam</span>
            <span className="footer-place__coords">52.3676° N, 4.9041° E</span>
          </div>
        </div>
        <div className="footer-legal">
          <p>© {year} Laurens Kersbergen. All rights reserved.</p>
          <ToTop />
        </div>
      </div>
    </footer>
  );
}

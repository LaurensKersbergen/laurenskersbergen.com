import { socials } from "@/lib/site";

const amsterdam = "https://www.google.com/maps/search/?api=1&query=Amsterdam";

/**
 * The foot of every page: the places to find Laurens in large type, where the
 * site is made, and the copyright.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="shell" data-reveal>
      <div className="site-footer">
        <div className="footer-links">
          <nav aria-label="Elsewhere" className="footer-social">
            {socials.map((social) => (
              <a key={social.label} href={social.href} {...(social.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
                {social.label}
              </a>
            ))}
          </nav>
          {/* Opens Google Maps in a new tab. */}
          <div className="footer-place">
            <a href={amsterdam} target="_blank" rel="noopener noreferrer" aria-label="Made in Amsterdam, on Google Maps">
              Made in Amsterdam
            </a>
          </div>
        </div>
        <div className="footer-legal">
          <p>© {year} Laurens Kersbergen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

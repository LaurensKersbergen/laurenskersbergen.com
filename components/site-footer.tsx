import { SitePreferences } from "@/components/site-preferences";
import { socials } from "@/lib/site";

const place = {
  city: "https://www.google.com/maps/search/?api=1&query=Amsterdam",
  point: "https://www.google.com/maps/search/?api=1&query=52.3676%2C4.9041",
};

/**
 * The foot of every page: the places to find Laurens in large type, where the
 * site is made, the copyright, and the switches for sounds and shortcuts.
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
          {/* Both lines open Google Maps in a new tab: the city, and the exact point the numbers name. */}
          <div className="footer-place">
            <a href={place.city} target="_blank" rel="noopener noreferrer" aria-label="Made in Amsterdam, on Google Maps">
              Made in Amsterdam
            </a>
            <a href={place.point} target="_blank" rel="noopener noreferrer" aria-label="52.3676° N, 4.9041° E, on Google Maps" className="footer-place__coords">
              52.3676° N, 4.9041° E
            </a>
          </div>
        </div>
        <div className="footer-legal">
          <p>© {year} Laurens Kersbergen. All rights reserved.</p>
          <SitePreferences />
        </div>
      </div>
    </footer>
  );
}

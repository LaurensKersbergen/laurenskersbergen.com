import { BookCall } from "@/components/book-call";
import { CopyEmail } from "@/components/copy-email";

/**
 * The page's last word before the footer: one line in the intro's two tones, then the two ways to
 * reach Laurens, a call (Cal.com, components/book-call.tsx) or his address with a copy button. No
 * form to fill in: the booking does that job, and the address works in any mail app.
 */
export function Contact() {
  return (
    <section aria-labelledby="contact-title" className="shell">
      <div className="contact" data-reveal>
        <h2 id="contact-title" className="contact__title">
          Working on something in data, AI or growth? <span className="contact__muted">I&apos;d love to hear about it.</span>
        </h2>
        <div className="contact__actions">
          <BookCall className="pill pill--strong" shortcut="w" />
          <CopyEmail />
        </div>
      </div>
    </section>
  );
}

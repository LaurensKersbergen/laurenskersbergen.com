import Image from "next/image";
import type { ReactNode } from "react";

interface LogoLinkProps {
  href: string;
  logo: string | ReactNode;
  children: string;
}

export function LogoLink({ href, logo, children }: LogoLinkProps) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className="logo-link"
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {typeof logo === "string" ? (
        <Image src={logo} alt="" width={36} height={36} className="logo-link-icon" />
      ) : (
        logo
      )}
      <span>{children}</span>
    </a>
  );
}

export function MailIcon() {
  return <span aria-hidden="true" className="logo-link-icon mail-icon" />;
}

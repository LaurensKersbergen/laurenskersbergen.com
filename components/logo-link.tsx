import Image from "next/image";

interface LogoLinkProps {
  href: string;
  logo: string;
  children: string;
}

export function LogoLink({ href, logo, children }: LogoLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="logo-link">
      <Image src={logo} alt="" width={36} height={36} className="logo-link-icon" />
      <span>{children}</span>
    </a>
  );
}

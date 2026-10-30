import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const MdxLink: MDXComponents["a"] = ({ href, children, ...props }) => {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: MdxLink,
    ...components,
  };
}

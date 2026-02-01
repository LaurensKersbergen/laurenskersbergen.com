import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  outputFileTracingRoot: __dirname,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);

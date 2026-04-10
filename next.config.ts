import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
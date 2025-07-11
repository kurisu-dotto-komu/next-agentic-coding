import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Let knip's built-in Next.js plugin handle most of the configuration

  // Ignore false positives - these are actually used
  ignoreDependencies: [
    "eslint",
    "eslint-config-next",
    "eslint-config-prettier",
    "tailwindcss",
    "postcss",
  ],
};

export default config;

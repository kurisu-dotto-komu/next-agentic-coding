import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["app/**/*.ts", "app/**/*.tsx", "convex/**/*.ts"],
    ignores: ["tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    ignores: ["convex/_generated/**"],
  },
];

export default eslintConfig;

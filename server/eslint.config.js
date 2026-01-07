import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Ignore generated and dependency folders
  {
    ignores: ["dist/**", "node_modules/**"]
  },

  // Base JS linting rules
  js.configs.recommended,

  // TypeScript linting rules (non-type-aware, simplest + stable)
  ...tseslint.configs.recommended
];

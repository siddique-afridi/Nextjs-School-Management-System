
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "node_modules/**"
  ]),

  js.configs.recommended,

  ...tseslint.configs.recommended,

  ...nextVitals,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",

      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    plugins: {
      prettier: prettierPlugin
    },

    rules: {
      "prettier/prettier": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      "prefer-const": "error",

      "no-var": "error",

      eqeqeq: ["error", "always"],

      "no-console": "off"
    }
  },

  prettier
]);

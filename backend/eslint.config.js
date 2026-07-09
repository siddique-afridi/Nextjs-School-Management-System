
import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: [
  "node_modules/**",
  "coverage/**",
  "uploads/**",
  "*.log",
  ".env*"
]
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node
      }
    },

    plugins: {
      prettier: prettierPlugin
    },

    rules: {
      "prettier/prettier": "error",

      "no-console": "off",
      "no-unused-vars": "warn",
      "no-undef": "error",

      "prefer-const": "error",
      "no-var": "error",

      eqeqeq: ["error", "always"],

      curly: ["error", "all"]
    }
  },

  prettier
];

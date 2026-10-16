import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Private admin navigation intentionally loads a new document rather than
  // retaining applicant/customer pages in the client router across sessions.
  { files: ['src/app/admin/**/*.tsx'], rules: { '@next/next/no-html-link-for-pages': 'off' } },
  globalIgnores([".next/**", "out/**", "test-results/**", ".sites-runtime/**", "next-env.d.ts"]),
]);

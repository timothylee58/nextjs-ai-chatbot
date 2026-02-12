/**
 * PostCSS Configuration
 *
 * PostCSS processes all CSS files at build time. The only plugin used is
 * @tailwindcss/postcss, which compiles Tailwind CSS v4 utility classes,
 * @apply directives, and custom variants into standard CSS.
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

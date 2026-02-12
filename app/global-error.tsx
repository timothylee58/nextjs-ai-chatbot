/**
 * Global Error Boundary — app/global-error.tsx
 *
 * Catches unhandled errors that occur OUTSIDE of route segments.
 * Unlike regular error.tsx files, this component completely replaces
 * the root layout — so it must render its own <html> and <body> tags.
 *
 * This file also fixes a known Next.js 16 prerender bug (#85668) where
 * the internal _global-error page fails to prerender when client providers
 * (ThemeProvider, SessionProvider) exist in the root layout. By providing
 * this standalone error page, the build can complete successfully.
 *
 * Uses inline styles instead of Tailwind because globals.css is not
 * available when the root layout has been replaced.
 */
"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h2>Something went wrong!</h2>
          <p>Please refresh the page to try again.</p>
        </div>
      </body>
    </html>
  );
}

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

"use client";

// Last-resort boundary: replaces the root layout, so it carries its own html/body.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#eceff0", color: "#0f0f12", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "6rem 1.25rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 500, margin: 0 }}>Uroko is not loading right now.</h1>
          <p style={{ color: "#55595c", lineHeight: 1.5 }}>
            Reload the page, or come back in a moment. Nothing you entered has been charged or sent anywhere.
          </p>
          <button
            onClick={reset}
            style={{ marginTop: "1.5rem", height: 48, padding: "0 1.5rem", background: "#0f0f12", color: "#eceff0", border: 0, cursor: "pointer" }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}

"use client";

export default function PanelError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card grid place-content-center gap-3 p-10 text-center">
      <h1 className="display text-3xl">Something went wrong</h1>
      <p className="text-sm text-mute">Page load fail hua. Dobara try karo — data load slow ho to thodi der baad.</p>
      <button type="button" onClick={reset} className="btn btn-dark mx-auto">
        Try again
      </button>
    </div>
  );
}

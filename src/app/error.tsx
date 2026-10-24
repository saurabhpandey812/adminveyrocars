"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<main className="wrap grid min-h-screen place-content-center gap-4 text-center"><h1 className="display text-5xl">Something went wrong.</h1><button onClick={reset} className="btn btn-dark mx-auto">Try again</button></main>);
}

import Link from "next/link";
export default function NotFound() {
  return (<main className="wrap grid min-h-screen place-content-center gap-4 text-center"><h1 className="display text-6xl">Not found.</h1><Link href="/admin" className="btn btn-dark mx-auto">Back to dashboard</Link></main>);
}

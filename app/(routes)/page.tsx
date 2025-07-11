import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-8 text-6xl font-bold">Hello! 👋</h1>
        <p className="mb-8 text-xl text-gray-600">Welcome to our Next.js application</p>
        <Link
          href="/tamagochi"
          className="inline-block rounded-lg bg-blue-500 px-8 py-3 text-lg text-white transition-colors hover:bg-blue-600"
        >
          Go to Tamagochi World
        </Link>
      </div>
    </div>
  );
}

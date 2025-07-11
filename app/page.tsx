import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950">
      <main className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4 text-amber-900 dark:text-amber-100">
          ☕ Coffee Quest
        </h1>
        <p className="text-xl mb-8 text-amber-700 dark:text-amber-300 max-w-md mx-auto">
          Join the ultimate collaborative coffee experience! Create your barista
          avatar, brew with friends, and master the art of coffee.
        </p>
        <Link
          href="/character"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Play Now
        </Link>
        <div className="mt-12 text-amber-600 dark:text-amber-400">
          <p className="text-sm">
            🎮 Real-time multiplayer • 🎨 Custom avatars • ☕ Mini-games
          </p>
        </div>
      </main>
    </div>
  );
}

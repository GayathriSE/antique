"use client";

export default function ShopError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="font-serif text-2xl font-bold text-stone-800 mb-2">Something went wrong</h2>
      <p className="text-stone-500 text-sm mb-6">{error.message}</p>
      <button onClick={reset} className="bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-amber-800 transition-colors">
        Try again
      </button>
    </div>
  );
}

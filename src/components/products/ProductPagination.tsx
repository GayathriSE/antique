"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ProductPagination({ page, totalPages, hasNext, hasPrev }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={!hasPrev}
        className="px-3 py-2 text-sm border border-stone-300 rounded-lg disabled:opacity-40 hover:bg-amber-50 hover:border-amber-400 transition-colors"
      >
        ← Prev
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <span key={p} className="flex items-center gap-2">
            {prev && p - prev > 1 && <span className="text-stone-400">…</span>}
            <button
              onClick={() => goToPage(p)}
              className={`w-10 h-10 text-sm rounded-lg transition-colors ${
                p === page
                  ? "bg-amber-700 text-white font-semibold"
                  : "border border-stone-300 text-stone-700 hover:bg-amber-50 hover:border-amber-400"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={!hasNext}
        className="px-3 py-2 text-sm border border-stone-300 rounded-lg disabled:opacity-40 hover:bg-amber-50 hover:border-amber-400 transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

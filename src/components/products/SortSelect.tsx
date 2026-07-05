"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/constants";

export default function SortSelect({ current }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current || "newest"}
      onChange={handleChange}
      className="text-sm border border-stone-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

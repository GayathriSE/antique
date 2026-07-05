"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  orderId: string;
  currentStatus: string;
  statuses: readonly { value: string; label: string }[];
}

export default function AdminOrderStatusUpdate({ orderId, currentStatus, statuses }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate() {
    setIsLoading(true);
    const result = await updateOrderStatus(orderId, status);
    setIsLoading(false);

    if (result.success) {
      toast.success("Order status updated");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 text-sm"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
        className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {isLoading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}

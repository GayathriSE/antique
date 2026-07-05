"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/admin";
import { toast } from "sonner";

export default function AdminProductActions({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setConfirming(false);
  }

  return (
    <button
      onClick={handleDelete}
      className={`text-xs transition-colors ${confirming ? "text-red-700 font-semibold" : "text-red-500 hover:text-red-700"}`}
    >
      {confirming ? "Confirm?" : "Delete"}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/validations/checkout";
import { getUserAddresses, createAddress, deleteAddress, setDefaultAddress } from "@/actions/user";
import { INDIAN_STATES } from "@/constants";
import { toast } from "sonner";
import type { Address } from "@prisma/client";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function refresh() {
    const data = await getUserAddresses();
    setAddresses(data);
  }

  useEffect(() => { refresh(); }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" },
  });

  async function onSubmit(data: AddressInput) {
    setIsLoading(true);
    const result = await createAddress(data);
    setIsLoading(false);

    if (result.success) {
      toast.success("Address added");
      reset();
      setShowForm(false);
      refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    await deleteAddress(id);
    toast.success("Address removed");
    refresh();
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id);
    toast.success("Default address updated");
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-800">Saved Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
          <h2 className="font-semibold text-stone-800 mb-5">New Address</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label><input {...register("name")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}</div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-stone-700 mb-1">Phone</label><input {...register("phone")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />{errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}</div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-stone-700 mb-1">Address Line 1</label><input {...register("line1")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />{errors.line1 && <p className="mt-1 text-xs text-red-600">{errors.line1.message}</p>}</div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-stone-700 mb-1">Line 2 (optional)</label><input {...register("line2")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">City</label><input {...register("city")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />{errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}</div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">State</label><select {...register("state")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"><option value="">Select</option>{INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}</select>{errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}</div>
            <div><label className="block text-sm font-medium text-stone-700 mb-1">PIN Code</label><input {...register("postalCode")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />{errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>}</div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={isLoading} className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
                {isLoading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p>No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-xl border p-5 ${addr.isDefault ? "border-amber-400" : "border-stone-200"}`}>
              {addr.isDefault && <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full mb-3 inline-block">Default</span>}
              <p className="font-semibold text-stone-800">{addr.name}</p>
              <p className="text-sm text-stone-600 mt-1">{addr.phone}</p>
              <p className="text-sm text-stone-600">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
              <p className="text-sm text-stone-600">{addr.city}, {addr.state} {addr.postalCode}</p>
              <div className="flex gap-3 mt-4">
                {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-amber-700 hover:underline">Set as default</button>}
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

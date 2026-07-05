"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/validations/checkout";
import { toast } from "sonner";
import { updateProfile } from "@/actions/user";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: session?.user?.name || "" },
  });

  async function onSubmit(data: ProfileInput) {
    setIsLoading(true);
    const result = await updateProfile(data);
    setIsLoading(false);

    if (result.success) {
      await update({ name: data.name });
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">Profile</h1>
      <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
            <input {...register("name")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input value={session?.user?.email || ""} readOnly className="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-500" />
            <p className="text-xs text-stone-400 mt-1">Email cannot be changed.</p>
          </div>
          <button type="submit" disabled={isLoading} className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

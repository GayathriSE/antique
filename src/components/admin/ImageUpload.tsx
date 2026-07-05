"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 6 }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) return null;

      const data = await res.json() as { url: string };
      return data.url;
    },
    []
  );

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    setIsUploading(true);

    const urls = await Promise.all(toUpload.map(uploadFile));
    const validUrls = urls.filter(Boolean) as string[];

    if (validUrls.length < toUpload.length) {
      toast.error("Some images failed to upload");
    }

    onChange([...images, ...validUrls]);
    setIsUploading(false);
    e.target.value = "";
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-stone-300 hover:border-amber-500 flex flex-col items-center justify-center cursor-pointer transition-colors">
            {isUploading ? (
              <div className="animate-spin w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full" />
            ) : (
              <>
                <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-stone-400 mt-1">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-stone-400">{images.length}/{maxImages} images. JPG, PNG, WEBP. Max 5MB each.</p>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: string;
}

export function ImageUpload({ images, onChange, productId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await uploadFiles(Array.from(files));
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    const newImages = [...images];

    try {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) throw new Error("Supabase not configured");

      for (const file of files) {
        // 1. Optimize image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(file, options);
        
        // 2. Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        // Use productId if available for folder organization, otherwise flat
        const path = productId ? `${productId}/${fileName}` : fileName;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(path, compressedFile);

        if (error) throw error;

        // 3. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);

        newImages.push(publicUrl);
      }

      onChange(newImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload one or more images. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group"
          >
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {isUploading ? (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-brand-500 hover:bg-brand-50 transition-all text-gray-400 hover:text-brand-500"
          >
            <Upload className="w-6 h-6" />
            <span className="text-[10px] font-bold">Upload</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        Add multiple high-quality photos. First image will be the cover.
      </p>
    </div>
  );
}

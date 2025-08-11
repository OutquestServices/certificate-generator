import React from 'react';

interface ImageUploaderProps {
  onFile: (file: File) => void;
  loading: boolean;
  error: string | null;
  width: number;
  height: number;
}

export function ImageUploader({ onFile, loading, error, width, height }: ImageUploaderProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }
  return (
    <div className="mb-4 rounded-lg border border-zinc-200 bg-white/70 p-4 text-xs dark:border-zinc-700 dark:bg-zinc-800/70">
      <label className="block text-[11px] font-medium mb-2">Upload Base Image (JPG, PNG, WEBP, AVIF)</label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
        onChange={handleChange}
        className="w-full cursor-pointer rounded-md border border-dashed border-zinc-300 bg-white/60 px-2 py-2 text-[11px] dark:border-zinc-600 dark:bg-zinc-700"
      />
      {loading && <p className="mt-1 text-[10px] text-zinc-500">Loading image...</p>}
      {error && <p className="mt-1 text-[10px] text-rose-600 dark:text-rose-400">{error}</p>}
      {!error && !loading && <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">Canvas size: {width} x {height}px</p>}
    </div>
  );
}

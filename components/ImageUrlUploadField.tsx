"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { imagesAPI } from "@/lib/api";
import { toast } from "sonner";

type Props = {
  label: string;
  helperText?: string;
  value: string;
  onChange: (url: string) => void;
  uploadName: string;
  required?: boolean;
  inputClassName?: string;
};

export function ImageUrlUploadField({
  label,
  helperText,
  value,
  onChange,
  uploadName,
  required = false,
  inputClassName,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Sign in to upload images");
      return;
    }
    setUploading(true);
    try {
      const url = await imagesAPI.uploadImage(file, uploadName);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 w-full min-w-0">
      <Label className="text-white text-sm font-medium">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Label>
      {helperText ? (
        <p className="text-xs text-white/50">{helperText}</p>
      ) : null}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className={
            inputClassName ??
            "bg-white/5 border-white/10 text-white h-11 flex-1 min-w-0"
          }
          required={required}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleFile}
        />
        <Button
          type="button"
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5 h-11 shrink-0"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {value && /^https?:\/\//i.test(value) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-1 max-h-32 rounded-md border border-white/10 object-contain bg-black/40"
        />
      ) : null}
    </div>
  );
}

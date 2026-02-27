"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { formatBytes } from "@/lib/utils";

interface DropZoneProps {
  videoFile: File | null;
  inputSize: number;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

export default function DropZone({
  videoFile,
  inputSize,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onInputChange,
  accept = "video/*",
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("dropZone");

  return (
    <div
      className={[
        "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer",
        "transition-all duration-200",
        isDragOver
          ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
          : "border-zinc-700 hover:border-violet-500/50 hover:bg-zinc-800/50",
      ].join(" ")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label={t("ariaLabel")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onInputChange}
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className={[
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200",
            isDragOver ? "bg-violet-500/20" : "bg-zinc-800",
          ].join(" ")}
        >
          <svg
            className={[
              "w-8 h-8 transition-colors duration-200",
              isDragOver ? "text-violet-400" : "text-zinc-500",
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {videoFile !== null ? (
          <div>
            <p className="text-zinc-100 font-semibold truncate max-w-sm mx-auto">
              {videoFile.name}
            </p>
            <p className="text-zinc-500 text-sm mt-1">
              {formatBytes(inputSize)} — {t("clickToChange")}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-zinc-200 font-semibold text-lg">
              {isDragOver ? t("dropIt") : t("dropHere")}
            </p>
            <p className="text-zinc-500 text-sm mt-1">{t("browse")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

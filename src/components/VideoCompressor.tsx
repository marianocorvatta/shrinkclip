"use client";

import { useRef, useState, useCallback, useTransition } from "react";
import Image from "next/image";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

type Status =
  | "idle"
  | "loading-ffmpeg"
  | "ready"
  | "processing"
  | "done"
  | "error";
type Quality = "low" | "medium" | "high";
type Format = "mp4" | "webm";

interface CompressionState {
  videoFile: File | null;
  status: Status;
  progress: number;
  outputUrl: string | null;
  inputSize: number;
  outputSize: number;
  quality: Quality;
  format: Format;
  errorMessage: string | null;
  isDragOver: boolean;
}

function buildFFmpegArgs(
  quality: Quality,
  format: Format,
  inputName: string,
  outputName: string
): string[] {
  if (format === "mp4") {
    const configs: Record<Quality, string[]> = {
      low: [
        "-i", inputName,
        "-vcodec", "libx264",
        "-crf", "35",
        "-preset", "fast",
        "-vf", "scale=640:-2",
        "-acodec", "aac",
        "-b:a", "64k",
        outputName,
      ],
      medium: [
        "-i", inputName,
        "-vcodec", "libx264",
        "-crf", "28",
        "-preset", "fast",
        "-vf", "scale=1280:-2",
        "-acodec", "aac",
        "-b:a", "128k",
        outputName,
      ],
      high: [
        "-i", inputName,
        "-vcodec", "libx264",
        "-crf", "23",
        "-preset", "fast",
        "-acodec", "aac",
        "-b:a", "192k",
        outputName,
      ],
    };
    return configs[quality];
  } else {
    const configs: Record<Quality, string[]> = {
      low: [
        "-i", inputName,
        "-vcodec", "libvpx-vp9",
        "-crf", "45",
        "-b:v", "0",
        "-vf", "scale=640:-2",
        "-acodec", "libopus",
        "-b:a", "64k",
        outputName,
      ],
      medium: [
        "-i", inputName,
        "-vcodec", "libvpx-vp9",
        "-crf", "33",
        "-b:v", "0",
        "-vf", "scale=1280:-2",
        "-acodec", "libopus",
        "-b:a", "128k",
        outputName,
      ],
      high: [
        "-i", inputName,
        "-vcodec", "libvpx-vp9",
        "-crf", "20",
        "-b:v", "0",
        "-acodec", "libopus",
        "-b:a", "192k",
        outputName,
      ],
    };
    return configs[quality];
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getDownloadFilename(originalName: string | undefined, format: Format): string {
  if (!originalName) return `compressed.${format}`;
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}_compressed.${format}`;
}

const initialState: CompressionState = {
  videoFile: null,
  status: "idle",
  progress: 0,
  outputUrl: null,
  inputSize: 0,
  outputSize: 0,
  quality: "medium",
  format: "mp4",
  errorMessage: null,
  isDragOver: false,
};

export default function VideoCompressor() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<CompressionState>(initialState);

  const loadFFmpeg = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading-ffmpeg" }));
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const ffmpeg = new FFmpeg();

      ffmpeg.on("log", ({ message }) => {
        console.log("[ffmpeg]", message);
      });

      ffmpeg.on("progress", ({ progress }) => {
        startTransition(() => {
          setState((prev) => ({
            ...prev,
            progress: Math.min(Math.round(progress * 100), 99),
          }));
        });
      });

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      ffmpegRef.current = ffmpeg;
      setState((prev) => ({ ...prev, status: "ready" }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load FFmpeg";
      setState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: `Could not load FFmpeg: ${message}`,
      }));
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setState((prev) => {
      if (prev.outputUrl) {
        URL.revokeObjectURL(prev.outputUrl);
      }
      return {
        ...prev,
        videoFile: file,
        inputSize: file.size,
        outputUrl: null,
        outputSize: 0,
        progress: 0,
        errorMessage: null,
        status: ffmpegRef.current ? "ready" : "idle",
      };
    });
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragOver: true }));
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragOver: false }));
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isDragOver: false }));
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const compress = useCallback(async () => {
    const { videoFile, quality, format } = state;
    if (!videoFile || !ffmpegRef.current) return;

    const ffmpeg = ffmpegRef.current;
    const ext = videoFile.name.split(".").pop()?.toLowerCase();
    const inputName = `input.${ext ?? "mp4"}`;
    const outputName = `output.${format}`;
    const outputMime = format === "mp4" ? "video/mp4" : "video/webm";

    setState((prev) => ({ ...prev, status: "processing", progress: 0 }));

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
      const args = buildFFmpegArgs(quality, format, inputName, outputName);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      // Double-cast via unknown to bypass the SharedArrayBufferLike constraint
      const bytes = new Uint8Array((data as unknown as ArrayBufferLike) as ArrayBuffer);
      const blob = new Blob([bytes], { type: outputMime });
      const url = URL.createObjectURL(blob);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      setState((prev) => ({
        ...prev,
        status: "done",
        outputUrl: url,
        outputSize: blob.size,
        progress: 100,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Compression failed";
      setState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: `Compression failed: ${message}`,
      }));
    }
  }, [state]);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.outputUrl) {
        URL.revokeObjectURL(prev.outputUrl);
      }
      return {
        ...initialState,
        quality: prev.quality,
        format: prev.format,
        status: ffmpegRef.current ? "ready" : "idle",
      };
    });
  }, []);

  const handleCompressClick = useCallback(() => {
    if (state.status === "idle" || state.status === "error") {
      loadFFmpeg().then(() => {
        if (ffmpegRef.current) {
          compress();
        }
      });
    } else if (state.status === "ready") {
      compress();
    }
  }, [state.status, loadFFmpeg, compress]);

  const isCompressDisabled =
    state.status === "loading-ffmpeg" ||
    state.status === "processing" ||
    state.videoFile === null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Image
          src="/logo-w.png"
          alt="ShrinkClip logo"
          width={96}
          height={96}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          ShrinkClip
        </h1>
        <p className="text-zinc-400 text-lg">
          Compress videos instantly in your browser
        </p>
      </div>

      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <svg
          className="w-4 h-4 text-emerald-500 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className="text-emerald-400 text-sm font-medium">
          Your video never leaves your device — all processing is done locally
        </span>
      </div>

      {/* Main card */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl">

        {/* Drop zone */}
        {state.status !== "done" ? (
          <div
            className={[
              "relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer",
              "transition-all duration-200",
              state.isDragOver
                ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                : "border-zinc-700 hover:border-violet-500/50 hover:bg-zinc-800/50",
            ].join(" ")}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              (document.getElementById("file-input") as HTMLInputElement | null)?.click()
            }
            role="button"
            tabIndex={0}
            aria-label="Drop video file here or click to select"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                (document.getElementById("file-input") as HTMLInputElement | null)?.click();
              }
            }}
          >
            <input
              id="file-input"
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={handleInputChange}
            />
            <div className="flex flex-col items-center gap-4">
              <div
                className={[
                  "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200",
                  state.isDragOver ? "bg-violet-500/20" : "bg-zinc-800",
                ].join(" ")}
              >
                <svg
                  className={[
                    "w-8 h-8 transition-colors duration-200",
                    state.isDragOver ? "text-violet-400" : "text-zinc-500",
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

              {state.videoFile !== null ? (
                <div>
                  <p className="text-zinc-100 font-semibold truncate max-w-sm mx-auto">
                    {state.videoFile.name}
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    {formatBytes(state.inputSize)} — click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-zinc-200 font-semibold text-lg">
                    {state.isDragOver ? "Drop it!" : "Drop your video here"}
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    or click to browse · MP4, WebM, MOV and more
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Controls */}
        {state.videoFile !== null &&
        state.status !== "processing" &&
        state.status !== "done" ? (
          <div className="mt-6 space-y-5">
            {/* Quality */}
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as Quality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() =>
                      setState((prev) => ({ ...prev, quality: q }))
                    }
                    className={[
                      "py-2.5 px-3 rounded-lg text-sm font-medium capitalize transition-all duration-150",
                      state.quality === q
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100",
                    ].join(" ")}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="text-zinc-600 text-xs mt-1.5">
                {state.quality === "low" && "Smallest file · 640p"}
                {state.quality === "medium" && "Balanced · 1280p"}
                {state.quality === "high" && "Best quality · original resolution"}
              </p>
            </div>

            {/* Format */}
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["mp4", "webm"] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() =>
                      setState((prev) => ({ ...prev, format: f }))
                    }
                    className={[
                      "py-2.5 px-3 rounded-lg text-sm font-semibold uppercase transition-all duration-150",
                      state.format === f
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100",
                    ].join(" ")}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {state.format === "webm" ? (
                <p className="text-amber-500/80 text-xs mt-1.5">
                  WebM (VP9) encoding is slower — may take several minutes
                </p>
              ) : null}
            </div>

            {/* Compress button */}
            <button
              onClick={handleCompressClick}
              disabled={isCompressDisabled}
              className={[
                "w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base",
                "bg-gradient-to-r from-violet-600 to-purple-600",
                "hover:from-violet-500 hover:to-purple-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200 shadow-lg shadow-violet-500/20",
                "active:scale-[0.98]",
              ].join(" ")}
            >
              {state.status === "loading-ffmpeg"
                ? "Loading FFmpeg…"
                : "Compress Video"}
            </button>
          </div>
        ) : null}

        {/* Progress */}
        {state.status === "processing" ? (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-400 font-medium">Compressing…</span>
              <span className="text-violet-400 font-bold tabular-nums">
                {state.progress}%
              </span>
            </div>
            <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <p className="text-zinc-600 text-xs text-center">
              {state.format === "webm"
                ? "VP9 encoding is thorough — this may take a few minutes"
                : "Large files may take a minute or two"}
            </p>
          </div>
        ) : null}

        {/* Results */}
        {state.status === "done" ? (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <p className="text-emerald-400 font-semibold text-lg">
                Compression complete!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-xl p-4 text-center">
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
                  Original
                </p>
                <p className="text-zinc-100 text-2xl font-bold">
                  {formatBytes(state.inputSize)}
                </p>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4 text-center border border-violet-500/30">
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
                  Compressed
                </p>
                <p className="text-violet-400 text-2xl font-bold">
                  {formatBytes(state.outputSize)}
                </p>
                {state.inputSize > 0 && state.outputSize > 0 ? (
                  <p className="text-emerald-400 text-xs font-semibold mt-1">
                    {Math.round((1 - state.outputSize / state.inputSize) * 100)}% smaller
                  </p>
                ) : null}
              </div>
            </div>

            <a
              href={state.outputUrl ?? "#"}
              download={getDownloadFilename(state.videoFile?.name, state.format)}
              className={[
                "flex items-center justify-center gap-2",
                "w-full py-3.5 px-6 rounded-xl font-semibold text-white text-base",
                "bg-gradient-to-r from-violet-600 to-purple-600",
                "hover:from-violet-500 hover:to-purple-500",
                "transition-all duration-200 shadow-lg shadow-violet-500/20",
                "active:scale-[0.98]",
              ].join(" ")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download {state.format.toUpperCase()}
            </a>

            <button
              onClick={reset}
              className={[
                "w-full py-2.5 px-6 rounded-xl font-medium text-zinc-400",
                "bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-100",
                "transition-all duration-200",
              ].join(" ")}
            >
              Compress another video
            </button>
          </div>
        ) : null}

        {/* Error */}
        {state.status === "error" ? (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-red-400 text-sm font-medium">
                  {state.errorMessage ?? "An unexpected error occurred."}
                </p>
                <button
                  onClick={reset}
                  className="mt-2 text-red-400 hover:text-red-300 text-sm underline transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer note */}
      <p className="text-zinc-600 text-xs text-center mt-6">
        Supports MP4, WebM, MOV, AVI and more · Powered by FFmpeg.wasm
      </p>
    </div>
  );
}

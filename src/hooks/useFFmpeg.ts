"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg, isFFmpegLoaded } from "@/lib/ffmpeg";
import { getMimeType, getExtension } from "@/lib/utils";

export type FFmpegStatus =
  | "idle"
  | "loading-ffmpeg"
  | "processing"
  | "done"
  | "error";

export interface UseFFmpegResult {
  status: FFmpegStatus;
  progress: number;
  errorMessage: string | null;
  loadAndExecute: (
    inputFile: File,
    buildArgs: (inputName: string, outputName: string) => string[],
    outputExtension: string
  ) => Promise<{ url: string; size: number } | null>;
  reset: () => void;
}

export function useFFmpeg(): UseFFmpegResult {
  const [status, setStatus] = useState<FFmpegStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const abortRef = useRef(false);
  const outputUrlRef = useRef<string | null>(null);

  const reset = useCallback(() => {
    abortRef.current = true;
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = null;
    }
    setStatus("idle");
    setProgress(0);
    setErrorMessage(null);
  }, []);

  const loadAndExecute = useCallback(
    async (
      inputFile: File,
      buildArgs: (inputName: string, outputName: string) => string[],
      outputExtension: string
    ): Promise<{ url: string; size: number } | null> => {
      abortRef.current = false;

      // Skip loading-ffmpeg flash if already loaded
      setStatus(isFFmpegLoaded() ? "processing" : "loading-ffmpeg");
      setProgress(0);
      setErrorMessage(null);

      let ffmpeg;
      try {
        ffmpeg = await getFFmpeg();
      } catch (err) {
        if (abortRef.current) return null;
        console.error("[useFFmpeg] load error:", err);
        const message =
          err instanceof Error ? err.message : String(err);
        setErrorMessage(`Could not load FFmpeg: ${message}`);
        setStatus("error");
        return null;
      }

      if (abortRef.current) return null;
      setStatus("processing");

      const onProgress = ({ progress }: { progress: number }) => {
        if (abortRef.current) return;
        startTransition(() => {
          setProgress(Math.min(Math.round(progress * 100), 99));
        });
      };

      ffmpeg.on("progress", onProgress);

      const ext = getExtension(inputFile);
      const inputName = `input.${ext}`;
      const outputName = `output.${outputExtension}`;
      const outputMime = getMimeType(outputExtension);

      try {
        await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
        const args = buildArgs(inputName, outputName);
        await ffmpeg.exec(args);

        if (abortRef.current) {
          await ffmpeg.deleteFile(inputName).catch(() => {});
          await ffmpeg.deleteFile(outputName).catch(() => {});
          return null;
        }

        const data = await ffmpeg.readFile(outputName);
        const bytes = new Uint8Array(
          (data as unknown as ArrayBufferLike) as ArrayBuffer
        );
        const blob = new Blob([bytes], { type: outputMime });
        const url = URL.createObjectURL(blob);

        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        if (outputUrlRef.current) {
          URL.revokeObjectURL(outputUrlRef.current);
        }
        outputUrlRef.current = url;

        setProgress(100);
        setStatus("done");
        return { url, size: blob.size };
      } catch (err) {
        if (abortRef.current) return null;
        const message =
          err instanceof Error ? err.message : "Processing failed";
        setErrorMessage(`Failed: ${message}`);
        setStatus("error");
        return null;
      } finally {
        ffmpeg.off("progress", onProgress);
      }
    },
    []
  );

  return { status, progress, errorMessage, loadAndExecute, reset };
}

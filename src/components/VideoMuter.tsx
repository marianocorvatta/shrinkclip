"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import DropZone from "./DropZone";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";
import DownloadButton from "./DownloadButton";
import ActionButton from "./ActionButton";
import ResetButton from "./ResetButton";
import ErrorDisplay from "./ErrorDisplay";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { useVideoFile } from "@/hooks/useVideoFile";
import { getDownloadFilename, getExtension } from "@/lib/utils";

interface VideoMuterProps {
  translations: {
    info: string;
    actionButton: string;
    loadingText: string;
    progressLabel: string;
    progressHint: string;
    outputLabel: string;
    successMessage: string;
    downloadLabel: string;
    resetButton: string;
  };
}

function buildMuteArgs(inputName: string, outputName: string): string[] {
  return ["-i", inputName, "-an", "-c:v", "copy", outputName];
}

export default function VideoMuter({ translations: t }: VideoMuterProps) {
  const te = useTranslations("error");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const {
    videoFile, inputSize, isDragOver,
    handleDragOver, handleDragLeave, handleDrop, handleInputChange, clearFile,
  } = useVideoFile();

  const { status, progress, errorMessage, loadAndExecute, reset: resetFFmpeg } = useFFmpeg();

  const handleRun = async () => {
    if (!videoFile) return;
    const ext = getExtension(videoFile);
    const safeExt = ext === "webm" ? "webm" : "mp4";
    const result = await loadAndExecute(videoFile, buildMuteArgs, safeExt);
    if (result) {
      setOutputUrl(result.url);
      setOutputSize(result.size);
    }
  };

  const handleReset = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setOutputSize(0);
    clearFile();
    resetFFmpeg();
  };

  const isDisabled =
    status === "loading-ffmpeg" || status === "processing" || videoFile === null;

  const ext = videoFile ? (getExtension(videoFile) === "webm" ? "webm" : "mp4") : "mp4";

  return (
    <div>
      {status !== "done" ? (
        <DropZone
          videoFile={videoFile}
          inputSize={inputSize}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onInputChange={handleInputChange}
        />
      ) : null}

      {videoFile !== null && status !== "processing" && status !== "done" ? (
        <div className="mt-6 space-y-5">
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm">{t.info}</p>
          </div>
          <ActionButton
            onClick={handleRun}
            disabled={isDisabled}
            loading={status === "loading-ffmpeg"}
            loadingText={t.loadingText}
          >
            {t.actionButton}
          </ActionButton>
        </div>
      ) : null}

      {status === "processing" ? (
        <ProgressBar
          progress={progress}
          label={t.progressLabel}
          hint={t.progressHint}
        />
      ) : null}

      {status === "done" && outputUrl !== null ? (
        <div className="space-y-4">
          <ResultCard
            inputSize={inputSize}
            outputSize={outputSize}
            outputLabel={t.outputLabel}
            successMessage={t.successMessage}
          />
          <DownloadButton
            url={outputUrl}
            filename={getDownloadFilename(videoFile?.name, "muted", ext)}
            label={t.downloadLabel.replace("{format}", ext.toUpperCase())}
          />
          <ResetButton onClick={handleReset}>{t.resetButton}</ResetButton>
        </div>
      ) : null}

      {status === "error" ? (
        <ErrorDisplay
          message={errorMessage ?? te("unexpected")}
          onRetry={handleReset}
        />
      ) : null}
    </div>
  );
}

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
import OptionSelector from "./OptionSelector";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { useVideoFile } from "@/hooks/useVideoFile";
import { getDownloadFilename } from "@/lib/utils";

type Rotation = "90cw" | "90ccw" | "180";

interface VideoRotatorProps {
  translations: {
    rotationLabel: string;
    "90cw": string;
    "90ccw": string;
    "180": string;
    hint90cw: string;
    hint90ccw: string;
    hint180: string;
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

const filterMap: Record<Rotation, string> = {
  "90cw": "transpose=1",
  "90ccw": "transpose=2",
  "180": "transpose=1,transpose=1",
};

function buildRotateArgs(
  rotation: Rotation,
  inputName: string,
  outputName: string
): string[] {
  return [
    "-i", inputName,
    "-vf", filterMap[rotation],
    "-vcodec", "libx264",
    "-crf", "23",
    "-preset", "fast",
    "-acodec", "aac",
    "-b:a", "192k",
    outputName,
  ];
}

export default function VideoRotator({ translations: t }: VideoRotatorProps) {
  const te = useTranslations("error");
  const [rotation, setRotation] = useState<Rotation>("90cw");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const rotationOptions = [
    { value: "90cw", label: t["90cw"] },
    { value: "90ccw", label: t["90ccw"] },
    { value: "180", label: t["180"] },
  ];

  const rotationHints: Record<Rotation, string> = {
    "90cw": t.hint90cw,
    "90ccw": t.hint90ccw,
    "180": t.hint180,
  };

  const {
    videoFile, inputSize, isDragOver,
    handleDragOver, handleDragLeave, handleDrop, handleInputChange, clearFile,
  } = useVideoFile();

  const { status, progress, errorMessage, loadAndExecute, reset: resetFFmpeg } = useFFmpeg();

  const handleRun = async () => {
    if (!videoFile) return;
    const result = await loadAndExecute(
      videoFile,
      (i, o) => buildRotateArgs(rotation, i, o),
      "mp4"
    );
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
          <OptionSelector
            label={t.rotationLabel}
            options={rotationOptions}
            selected={rotation}
            onChange={(v) => setRotation(v as Rotation)}
            hint={rotationHints[rotation]}
            columns={3}
          />
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
            filename={getDownloadFilename(videoFile?.name, "rotated", "mp4")}
            label={t.downloadLabel}
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

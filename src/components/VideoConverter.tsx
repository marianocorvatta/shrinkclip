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

type ConvertFormat = "mp4" | "webm";

interface VideoConverterProps {
  translations: {
    formatLabel: string;
    webmHint: string;
    actionButton: string;
    loadingText: string;
    progressLabel: string;
    progressHintWebm: string;
    outputLabel: string;
    successMessage: string;
    downloadLabel: string;
    resetButton: string;
  };
}

function buildConvertArgs(
  outputFormat: ConvertFormat,
  inputName: string,
  outputName: string
): string[] {
  if (outputFormat === "mp4") {
    return [
      "-i", inputName,
      "-vcodec", "libx264",
      "-crf", "23",
      "-preset", "fast",
      "-acodec", "aac",
      "-b:a", "192k",
      outputName,
    ];
  }
  return [
    "-i", inputName,
    "-vcodec", "libvpx-vp9",
    "-crf", "23",
    "-b:v", "0",
    "-acodec", "libopus",
    "-b:a", "192k",
    outputName,
  ];
}

const formatOptions = [
  { value: "mp4", label: "MP4" },
  { value: "webm", label: "WebM" },
];

export default function VideoConverter({ translations: t }: VideoConverterProps) {
  const te = useTranslations("error");
  const [outputFormat, setOutputFormat] = useState<ConvertFormat>("mp4");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const {
    videoFile, inputSize, isDragOver,
    handleDragOver, handleDragLeave, handleDrop, handleInputChange, clearFile,
  } = useVideoFile();

  const { status, progress, errorMessage, loadAndExecute, reset: resetFFmpeg } = useFFmpeg();

  const handleRun = async () => {
    if (!videoFile) return;
    const result = await loadAndExecute(
      videoFile,
      (i, o) => buildConvertArgs(outputFormat, i, o),
      outputFormat
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
            label={t.formatLabel}
            options={formatOptions}
            selected={outputFormat}
            onChange={(v) => setOutputFormat(v as ConvertFormat)}
            hint={outputFormat === "webm" ? t.webmHint : null}
            columns={2}
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
          hint={outputFormat === "webm" ? t.progressHintWebm : undefined}
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
            filename={getDownloadFilename(videoFile?.name, "converted", outputFormat)}
            label={t.downloadLabel.replace("{format}", outputFormat.toUpperCase())}
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

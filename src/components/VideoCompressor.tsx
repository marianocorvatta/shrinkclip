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

type Quality = "low" | "medium" | "high";
type Format = "mp4" | "webm";

function buildCompressArgs(
  quality: Quality,
  format: Format,
  inputName: string,
  outputName: string
): string[] {
  const crfs: Record<Quality, string> = { low: "35", medium: "28", high: "23" };
  const scales: Record<Quality, string[]> = {
    low: ["-vf", "scale=640:-2"],
    medium: ["-vf", "scale=1280:-2"],
    high: [],
  };
  const bitrates: Record<Quality, string> = {
    low: "64k",
    medium: "128k",
    high: "192k",
  };

  if (format === "mp4") {
    return [
      "-i", inputName,
      "-vcodec", "libx264",
      "-crf", crfs[quality],
      "-preset", "fast",
      ...scales[quality],
      "-acodec", "aac",
      "-b:a", bitrates[quality],
      outputName,
    ];
  }
  return [
    "-i", inputName,
    "-vcodec", "libvpx-vp9",
    "-crf", crfs[quality],
    "-b:v", "0",
    ...scales[quality],
    "-acodec", "libopus",
    "-b:a", bitrates[quality],
    outputName,
  ];
}

export default function VideoCompressor() {
  const t = useTranslations("compressor");
  const te = useTranslations("error");
  const [quality, setQuality] = useState<Quality>("medium");
  const [format, setFormat] = useState<Format>("mp4");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const {
    videoFile, inputSize, isDragOver,
    handleDragOver, handleDragLeave, handleDrop, handleInputChange, clearFile,
  } = useVideoFile();

  const { status, progress, errorMessage, loadAndExecute, reset: resetFFmpeg } = useFFmpeg();

  const qualityOptions = [
    { value: "low", label: t("qualityLow") },
    { value: "medium", label: t("qualityMedium") },
    { value: "high", label: t("qualityHigh") },
  ];

  const formatOptions = [
    { value: "mp4", label: "MP4" },
    { value: "webm", label: "WebM" },
  ];

  const qualityHints: Record<Quality, string> = {
    low: t("qualityHintLow"),
    medium: t("qualityHintMedium"),
    high: t("qualityHintHigh"),
  };

  const handleRun = async () => {
    if (!videoFile) return;
    const result = await loadAndExecute(
      videoFile,
      (i, o) => buildCompressArgs(quality, format, i, o),
      format
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
            label={t("qualityLabel")}
            options={qualityOptions}
            selected={quality}
            onChange={(v) => setQuality(v as Quality)}
            hint={qualityHints[quality]}
            columns={3}
          />
          <OptionSelector
            label={t("formatLabel")}
            options={formatOptions}
            selected={format}
            onChange={(v) => setFormat(v as Format)}
            hint={format === "webm" ? t("webmHint") : null}
            columns={2}
          />
          <ActionButton
            onClick={handleRun}
            disabled={isDisabled}
            loading={status === "loading-ffmpeg"}
            loadingText={t("loadingText")}
          >
            {t("actionButton")}
          </ActionButton>
        </div>
      ) : null}

      {status === "processing" ? (
        <ProgressBar
          progress={progress}
          label={t("progressLabel")}
          hint={format === "webm" ? t("progressHintWebm") : t("progressHintDefault")}
        />
      ) : null}

      {status === "done" && outputUrl !== null ? (
        <div className="space-y-4">
          <ResultCard
            inputSize={inputSize}
            outputSize={outputSize}
            outputLabel={t("outputLabel")}
            successMessage={t("successMessage")}
          />
          <DownloadButton
            url={outputUrl}
            filename={getDownloadFilename(videoFile?.name, "compressed", format)}
            label={t("downloadLabel", { format: format.toUpperCase() })}
          />
          <ResetButton onClick={handleReset}>{t("resetButton")}</ResetButton>
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

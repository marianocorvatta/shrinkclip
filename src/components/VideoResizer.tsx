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

function buildResizeArgs(
  width: string,
  inputName: string,
  outputName: string
): string[] {
  return [
    "-i", inputName,
    "-vcodec", "libx264",
    "-crf", "23",
    "-preset", "fast",
    "-vf", `scale=${width}:-2`,
    "-acodec", "aac",
    "-b:a", "192k",
    outputName,
  ];
}

export default function VideoResizer() {
  const t = useTranslations("resizer");
  const te = useTranslations("error");
  const [preset, setPreset] = useState("1920");
  const [customWidth, setCustomWidth] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const PRESETS = [
    { value: "3840", label: "4K" },
    { value: "1920", label: "1080p" },
    { value: "1280", label: "720p" },
    { value: "854", label: "480p" },
    { value: "640", label: "360p" },
    { value: "custom", label: t("custom") },
  ];

  const {
    videoFile, inputSize, isDragOver,
    handleDragOver, handleDragLeave, handleDrop, handleInputChange, clearFile,
  } = useVideoFile();

  const { status, progress, errorMessage, loadAndExecute, reset: resetFFmpeg } = useFFmpeg();

  const getWidth = (): string | null => {
    if (preset !== "custom") return preset;
    const w = parseInt(customWidth, 10);
    if (!w || w < 128 || w > 7680) {
      setCustomError(t("customError"));
      return null;
    }
    return String(w % 2 === 0 ? w : w + 1);
  };

  const handleRun = async () => {
    if (!videoFile) return;
    const width = getWidth();
    if (!width) return;
    setCustomError(null);
    const result = await loadAndExecute(
      videoFile,
      (i, o) => buildResizeArgs(width, i, o),
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

  const displayWidth = preset !== "custom" ? `${preset}px` : customWidth ? `${customWidth}px` : "?";

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
            label={t("resolutionLabel")}
            options={PRESETS}
            selected={preset}
            onChange={(v) => {
              setPreset(v);
              setCustomError(null);
            }}
            columns={3}
          />
          {preset === "custom" ? (
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                {t("customWidthLabel")}
              </label>
              <input
                type="number"
                min={128}
                max={7680}
                value={customWidth}
                onChange={(e) => {
                  setCustomWidth(e.target.value);
                  setCustomError(null);
                }}
                placeholder={t("customPlaceholder")}
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
              {customError ? (
                <p className="text-red-400 text-xs mt-1">{customError}</p>
              ) : (
                <p className="text-zinc-600 text-xs mt-1">{t("customHint")}</p>
              )}
            </div>
          ) : null}
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
          hint={t("progressHint")}
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
            filename={getDownloadFilename(
              videoFile?.name,
              `resized_${displayWidth}`,
              "mp4"
            )}
            label={t("downloadLabel")}
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

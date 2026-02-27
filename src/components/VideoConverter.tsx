"use client";

import { useState } from "react";
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

export default function VideoConverter() {
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
            label="Output Format"
            options={formatOptions}
            selected={outputFormat}
            onChange={(v) => setOutputFormat(v as ConvertFormat)}
            hint={
              outputFormat === "webm"
                ? "WebM (VP9) encoding may take several minutes"
                : null
            }
            columns={2}
          />
          <ActionButton
            onClick={handleRun}
            disabled={isDisabled}
            loading={status === "loading-ffmpeg"}
            loadingText="Loading FFmpeg…"
          >
            Convert Video
          </ActionButton>
        </div>
      ) : null}

      {status === "processing" ? (
        <ProgressBar
          progress={progress}
          label="Converting…"
          hint={
            outputFormat === "webm"
              ? "VP9 encoding is thorough — this may take a few minutes"
              : undefined
          }
        />
      ) : null}

      {status === "done" && outputUrl !== null ? (
        <div className="space-y-4">
          <ResultCard
            inputSize={inputSize}
            outputSize={outputSize}
            outputLabel="Converted"
            successMessage="Conversion complete!"
          />
          <DownloadButton
            url={outputUrl}
            filename={getDownloadFilename(videoFile?.name, "converted", outputFormat)}
            label={`Download ${outputFormat.toUpperCase()}`}
          />
          <ResetButton onClick={handleReset}>Convert another video</ResetButton>
        </div>
      ) : null}

      {status === "error" ? (
        <ErrorDisplay
          message={errorMessage ?? "An unexpected error occurred."}
          onRetry={handleReset}
        />
      ) : null}
    </div>
  );
}

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

type Rotation = "90cw" | "90ccw" | "180";

const rotationOptions = [
  { value: "90cw", label: "90° CW" },
  { value: "90ccw", label: "90° CCW" },
  { value: "180", label: "180°" },
];

const filterMap: Record<Rotation, string> = {
  "90cw": "transpose=1",
  "90ccw": "transpose=2",
  "180": "transpose=1,transpose=1",
};

const rotationHints: Record<Rotation, string> = {
  "90cw": "Rotate 90° clockwise",
  "90ccw": "Rotate 90° counter-clockwise",
  "180": "Flip upside down",
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

export default function VideoRotator() {
  const [rotation, setRotation] = useState<Rotation>("90cw");
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
            label="Rotation"
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
            loadingText="Loading FFmpeg…"
          >
            Rotate Video
          </ActionButton>
        </div>
      ) : null}

      {status === "processing" ? (
        <ProgressBar
          progress={progress}
          label="Rotating…"
          hint="Re-encoding video with new orientation"
        />
      ) : null}

      {status === "done" && outputUrl !== null ? (
        <div className="space-y-4">
          <ResultCard
            inputSize={inputSize}
            outputSize={outputSize}
            outputLabel="Rotated"
            successMessage="Rotation complete!"
          />
          <DownloadButton
            url={outputUrl}
            filename={getDownloadFilename(videoFile?.name, "rotated", "mp4")}
            label="Download MP4"
          />
          <ResetButton onClick={handleReset}>Rotate another video</ResetButton>
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

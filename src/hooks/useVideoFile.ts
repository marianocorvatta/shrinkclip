"use client";

import { useState, useCallback } from "react";

export interface UseVideoFileResult {
  videoFile: File | null;
  inputSize: number;
  isDragOver: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
  setFile: (file: File) => void;
}

export function useVideoFile(): UseVideoFileResult {
  const [videoFile, setVideoFileState] = useState<File | null>(null);
  const [inputSize, setInputSize] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const setFile = useCallback((file: File) => {
    setVideoFileState(file);
    setInputSize(file.size);
  }, []);

  const clearFile = useCallback(() => {
    setVideoFileState(null);
    setInputSize(0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        setFile(file);
      }
    },
    [setFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setFile(file);
    },
    [setFile]
  );

  return {
    videoFile,
    inputSize,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    clearFile,
    setFile,
  };
}

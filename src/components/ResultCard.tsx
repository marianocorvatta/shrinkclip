"use client";

import { useTranslations } from "next-intl";
import { formatBytes } from "@/lib/utils";

interface ResultCardProps {
  inputSize: number;
  outputSize: number;
  outputLabel?: string;
  successMessage?: string;
}

export default function ResultCard({
  inputSize,
  outputSize,
  outputLabel = "Output",
  successMessage = "Done!",
}: ResultCardProps) {
  const t = useTranslations("result");
  const savings =
    inputSize > 0 && outputSize > 0
      ? Math.round((1 - outputSize / inputSize) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-emerald-400 font-semibold text-lg">
          {successMessage}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-navy rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
            {t("original")}
          </p>
          <p className="text-zinc-100 text-2xl font-bold">
            {formatBytes(inputSize)}
          </p>
        </div>
        <div className="bg-navy rounded-xl p-4 text-center border border-accent/30">
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-2">
            {outputLabel}
          </p>
          <p className="text-accent text-2xl font-bold">
            {formatBytes(outputSize)}
          </p>
          {savings > 0 ? (
            <p className="text-emerald-400 text-xs font-semibold mt-1">
              {t("smaller", { percent: savings })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

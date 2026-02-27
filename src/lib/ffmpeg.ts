import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const CDN_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export function isFFmpegLoaded(): boolean {
  return instance !== null;
}

export async function getFFmpeg(): Promise<FFmpeg> {
  if (instance) return instance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    ffmpeg.on("log", ({ message }) => {
      console.log("[ffmpeg]", message);
    });

    const [classWorkerURL, coreURL, wasmURL] = await Promise.all([
      toBlobURL("/ffmpeg-worker.js", "text/javascript"),
      toBlobURL(`${CDN_BASE}/ffmpeg-core.js`, "text/javascript"),
      toBlobURL(`${CDN_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    ]);

    await ffmpeg.load({ classWorkerURL, coreURL, wasmURL });

    instance = ffmpeg;
    return ffmpeg;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    loadPromise = null;
    throw err;
  }
}

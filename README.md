<div align="center">
  <img src="https://shrinkclip.com/api/og" alt="ShrinkClip" width="120" height="120" style="border-radius: 24px;" />
</div>

# ShrinkClip

Free, open source online video compressor that runs 100% in your browser using ffmpeg.wasm. No uploads, no servers, no privacy concerns.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-orange.svg)](https://github.com/mcorvatta/shrinkclip)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mcorvatta/shrinkclip)

---

## ✨ Features

- **100% browser-based** — No file uploads, everything happens locally in your browser
- **Video compression** — Quality control with Low, Medium, and High presets
- **Format conversion** — Convert between MP4, WebM, MOV, and AVI
- **Resolution control** — Scale down from 4K to 1080p or 720p
- **Audio control** — Mute video by removing audio track
- **Rotation** — Rotate video 90°, 180° clockwise or counter-clockwise
- **Bilingual** — Full English and Spanish support with SEO-optimized URLs
- **Modern UI** — Dark theme with smooth animations
- **Fully responsive** — Works on desktop, tablet, and mobile

---

## 🚀 Demo

Try it live at **[shrinkclip.com](https://shrinkclip.com)**

![ShrinkClip Screenshot](https://shrinkclip.com/api/screenshot)

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-------------|---------|---------|
| Next.js | 16 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| ffmpeg.wasm | latest | Browser-based video processing |
| next-intl | latest | Internationalization |

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mcorvatta/shrinkclip.git

# Navigate to project directory
cd shrinkclip

# Install dependencies
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

---

## 🌍 Internationalization

The app supports English (`/en/`) and Spanish (`/es/`) with SEO-optimized URLs.

### URL Structure

```
https://shrinkclip.com/en/        → English
https://shrinkclip.com/es/        → Spanish
```

### Adding a New Language

1. **Create translation file** — Add JSON file in `messages/` directory:
   ```bash
   cp messages/en.json messages/fr.json
   ```

2. **Translate strings** — Edit `messages/fr.json` with French translations

3. **Add locale to config** — Update `i18n.ts`:
   ```typescript
   export const locales = ['en', 'es', 'fr'] as const;
   export const localeNames = { en: 'English', es: 'Español', fr: 'Français' };
   ```

4. **Create route segment** — Add `app/[locale]/page.tsx` folder structure

Translation files live in the `messages/` directory at the root of the project.

---

## 📁 Project Structure

```
shrinkclip/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Locale-based routing (en, es)
│   │   ├── page.tsx             # Home page
│   │   └── layout.tsx           # Locale layout
│   ├── api/                     # API routes
│   │   └── og/                  # Open Graph image generation
│   ├── globals.css              # Global Tailwind styles
│   └── layout.tsx               # Root layout
├── components/                  # React components
│   ├── ui/                      # Reusable UI components
│   ├── video/                   # Video-related components
│   └── ...                      # Other feature components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── messages/                    # Translation JSON files
│   ├── en.json                  # English strings
│   └── es.json                  # Spanish strings
├── public/                      # Static assets
├── i18n.ts                      # Internationalization config
├── middleware.ts                # Locale detection middleware
├── next.config.*                # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Opening Issues

Found a bug or have a feature request? [Open an issue](https://github.com/mcorvatta/shrinkclip/issues) with a clear description.

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- **TypeScript** — Strict mode enabled, no `any` types
- **Styling** — Tailwind CSS only, no external UI libraries
- **Components** — Functional components with hooks
- **Formatting** — Prettier enforced, run `npm run lint` before committing

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgements

- [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) — The magic that makes browser-based video processing possible
- [Next.js](https://nextjs.org) — The framework that powers this project

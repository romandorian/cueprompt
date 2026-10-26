# Local processing dependencies

- Tesseract.js 6.0.1 and tesseract.js-core 6.0.0, Apache-2.0: https://github.com/naptha/tesseract.js and https://github.com/naptha/tesseract.js-core . The OCR LICENSE and bundled notice files accompany the distribution.
- English and Simplified Chinese trained data from @tesseract.js-data/eng and @tesseract.js-data/chi_sim 1.0.0, derived from https://github.com/tesseract-ocr/tessdata_best (Apache-2.0).
- @ffmpeg/ffmpeg 0.12.15 wrapper (MIT): https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.15 .
- @ffmpeg/core 0.12.10 compiled FFmpeg 5.1.4 with GPL-enabled codecs: corresponding build source, dependency sources and build instructions https://github.com/ffmpegwasm/ffmpeg.wasm/tree/main/packages/core and https://github.com/ffmpegwasm/ffmpeg.wasm/tree/main/build . FFmpeg licensing: https://ffmpeg.org/legal.html . The original unmodified npm package is https://registry.npmjs.org/@ffmpeg/core/-/core-0.12.10.tgz . The WASM binary is split into four sequential parts for hosting; concatenating aa, ab, ac, ad restores the original binary.

No library downloads user media to an external service. Explicit transcription requests are separate from these local engines.

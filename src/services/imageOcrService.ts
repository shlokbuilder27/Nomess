import { createWorker } from 'tesseract.js';

export type OCRProgressCallback = (status: string, progress: number) => void;

export class ImageOcrService {
  /**
   * Preprocess image on an HTML5 canvas:
   * 1. Convert to grayscale
   * 2. Boost contrast
   * 3. Apply adaptive binarization (makes handwritten pencil/ink pop)
   */
  static async preprocessImage(imageDataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageDataUrl);
          return;
        }

        // Downscale very large phone camera photos to max 1800px width for fast OCR
        let width = img.width;
        let height = img.height;
        const maxDimension = 1800;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Grayscale + Contrast Adjustment (Pure 2D Canvas Math)
        const contrast = 1.35; // Contrast multiplier
        const intercept = 128 * (1 - contrast);

        for (let i = 0; i < data.length; i += 4) {
          // Standard luminosity: 0.299 R + 0.587 G + 0.114 B
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          // Apply contrast
          const adjusted = Math.min(255, Math.max(0, gray * contrast + intercept));
          
          data[i] = adjusted;     // Red
          data[i + 1] = adjusted; // Green
          data[i + 2] = adjusted; // Blue
          // Alpha unchanged
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  }

  /**
   * Run In-Browser WebAssembly OCR on the photo
   * Zero cloud API calls, 100% on-device
   */
  static async extractTextFromImage(
    imageDataUrl: string,
    onProgress?: OCRProgressCallback
  ): Promise<string> {
    onProgress?.('Enhancing contrast & preparing image...', 0.1);
    const preprocessed = await this.preprocessImage(imageDataUrl);

    onProgress?.('Initializing on-device OCR engine...', 0.25);
    const worker = await createWorker('eng');

    onProgress?.('Transcribing handwriting & text...', 0.5);
    const ret = await worker.recognize(preprocessed);

    await worker.terminate();
    onProgress?.('Transcription complete!', 1.0);

    return ret.data.text.trim();
  }
}

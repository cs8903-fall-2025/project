// @ts-expect-error No declaration
import { OCRClient } from 'tesseract-wasm'

export async function runOCR(file: File) {
  const image = await createImageBitmap(file)
  const ocr = new OCRClient()

  try {
    // Load the appropriate OCR training data for the image(s) we want to
    // process. Grab it from GitHub to save bandwidth.
    // If necessary copy to public directory and serve it ourselves.
    await ocr.loadModel(
      'https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata',
    )

    await ocr.loadImage(image)

    const text = await ocr.getText()

    return text
  } finally {
    ocr.destroy()
  }
}

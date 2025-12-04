// @ts-expect-error No declaration
import { OCRClient } from 'tesseract-wasm'

export async function runOCR(file: File) {
  const image = await createImageBitmap(file)

  // Initialize the OCR engine. This will start a Web Worker to do the
  // work in the background.
  const ocr = new OCRClient()

  try {
    // Load the appropriate OCR training data for the image(s) we want to
    // process. Grab it from GitHub to save bandwidth.
    // If necessary copy to public directory and serve it ourselves.
    await ocr.loadModel(
      'https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata',
    )

    await ocr.loadImage(image)

    // Perform text recognition and return text in reading order.
    const text = await ocr.getText()

    console.log('OCR text: ', text)
  } finally {
    // Once all OCR-ing has been done, shut down the Web Worker and free up
    // resources.
    ocr.destroy()
  }
}

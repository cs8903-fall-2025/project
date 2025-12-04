import { OcrEngine, OcrEngineInit, default as initOcrLib } from '@/ocrs'

export async function initOcrEngine() {
  const response = await fetch('/ocrs_bg.wasm')
  const wasmBinary = response.arrayBuffer()

  // Ignore third result. We are just initializing the OCR library at the same time
  // we download the models.
  const [textDetectionModel, textRecognitionModel] = await Promise.all([
    fetch('/text-detection.rten').then((response) => response.arrayBuffer()),
    fetch('/text-recognition.rten').then((response) => response.arrayBuffer()),
    initOcrLib(wasmBinary),
  ])

  const initializer = new OcrEngineInit()
  initializer.setDetectionModel(new Uint8Array(textDetectionModel))
  initializer.setRecognitionModel(new Uint8Array(textRecognitionModel))

  const engine = new OcrEngine(initializer)
  return engine
}

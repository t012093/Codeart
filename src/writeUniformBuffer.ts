export function createUniformUpdater(
  device: GPUDevice,
  canvas: HTMLCanvasElement,
  uniformBuffer: GPUBuffer,
  uniformData: Float32Array
) {
  const startTime = performance.now();

  return function updateUniform() {
    // 経過時間を秒単位で計算
    uniformData[0] = (performance.now() - startTime) / 1000;
    // パディング（未使用）
    uniformData[1] = 0;
    // キャンバスの幅と高さ
    uniformData[2] = canvas.width;
    uniformData[3] = canvas.height;

    // デバイスキューを通じてバッファに書き込む
    device.queue.writeBuffer(uniformBuffer, 0, uniformData);
  };
}

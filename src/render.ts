export function createRenderLoop(
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline,
  vertexBuffer: GPUBuffer,
  indexBuffer: GPUBuffer,
  uniformBindGroup: GPUBindGroup,
  updateUniform: () => void,
  vertexCount: number
) {
  return function render() {
    // Uniformバッファの更新
    updateUniform();

    // コマンドエンコーダの作成
    const commandEncoder = device.createCommandEncoder();

    // 現在のキャンバステクスチャを取得
    const textureView = context.getCurrentTexture().createView();

    // レンダーパスの開始
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });

    // パイプラインとバッファの設定
    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, uniformBindGroup);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setIndexBuffer(indexBuffer, "uint16");
    
    // 描画コマンド
    renderPass.drawIndexed(vertexCount);
    
    // レンダーパスの終了
    renderPass.end();

    // コマンドバッファの生成と送信
    device.queue.submit([commandEncoder.finish()]);

    // 次のフレームをリクエスト
    requestAnimationFrame(render);
  };
}

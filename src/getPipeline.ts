export async function createRenderPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  uniformBindGroupLayout: GPUBindGroupLayout
) {
  // シェーダーモジュールの読み込み
  const vertexShaderModule = device.createShaderModule({
    code: await (await fetch(new URL('./shader/vertex.wgsl', import.meta.url))).text(),
  });

  const fragmentShaderModule = device.createShaderModule({
    code: await (await fetch(new URL('./shader/fragment.wgsl', import.meta.url))).text(),
  });

  // パイプラインレイアウトの作成
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [uniformBindGroupLayout],
  });

  // レンダーパイプラインの作成
  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: vertexShaderModule,
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 8,  // 2 * sizeof(float)
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x2",
            },
          ],
        },
      ],
    },
    fragment: {
      module: fragmentShaderModule,
      entryPoint: "main",
      targets: [
        {
          format: format,
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  return pipeline;
}

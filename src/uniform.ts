export function createUniformBuffer(device: GPUDevice) {
  // 時間、パディング、解像度 (16バイト = 4 * float)
  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // バインドグループレイアウトを作成
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
        },
      },
    ],
  });

  // UniformバッファのバインドグループとFloat32Array作成
  const uniformBindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  // Uniformバッファに転送するためのFloat32Array
  const uniformData = new Float32Array(4); // time, padding, width, height

  return {
    uniformBuffer,
    uniformBindGroup,
    bindGroupLayout,
    uniformData,
  };
}

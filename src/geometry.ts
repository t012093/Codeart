export function createGeometry(device: GPUDevice) {
  // 頂点バッファ：フルスクリーン四角形（クリップ空間座標）
  const vertices = new Float32Array([
    -1.0, 1.0,  // 左上
    -1.0, -1.0, // 左下
    1.0, -1.0,  // 右下
    1.0, 1.0,   // 右上
  ]);
  
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
  vertexBuffer.unmap();

  // インデックスバッファ：二つの三角形で四角形を構成
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]); // 2つの三角形
  
  const indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Uint16Array(indexBuffer.getMappedRange()).set(indices);
  indexBuffer.unmap();

  return { 
    vertexBuffer, 
    indexBuffer, 
    vertexCount: indices.length 
  };
}

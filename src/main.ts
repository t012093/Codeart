import './style.css';
import { initializeWebGPU } from './initialize';
import { createGeometry } from './geometry';
import { createRenderPipeline } from './getPipeline';
import { createUniformBuffer } from './uniform';
import { createUniformUpdater } from './writeUniformBuffer';
import { createRenderLoop } from './render';

// WebGPUをサポートしているか確認するメッセージ
const app = document.querySelector<HTMLDivElement>('#app')!;
if (!navigator.gpu) {
  app.innerHTML = `
    <div class="error">
      <h1>WebGPU not supported</h1>
      <p>Your browser does not support WebGPU, or it is disabled.</p>
      <p>Try using Chrome Canary with the flag: chrome://flags/#enable-unsafe-webgpu</p>
    </div>
  `;
  throw new Error('WebGPU not supported');
}

// メイン処理の定義
async function main() {
  app.innerHTML = `
    <canvas id="canvas"></canvas>
    <div class="controls">
      <div class="title">Step21 WebGPU シェーダーアート</div>
    </div>
  `;

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  
  try {
    // WebGPUの初期化
    const { device, context, format } = await initializeWebGPU(canvas);
    
    // ジオメトリの作成
    const { vertexBuffer, indexBuffer, vertexCount } = createGeometry(device);
    
    // Uniformバッファとバインドグループの作成
    const { uniformBuffer, uniformBindGroup, bindGroupLayout, uniformData } = createUniformBuffer(device);
    
    // レンダーパイプラインの作成
    const pipeline = await createRenderPipeline(device, format, bindGroupLayout);
    
    // Uniformアップデーターの作成
    const updateUniform = createUniformUpdater(device, canvas, uniformBuffer, uniformData);
    
    // レンダリングループの作成と開始
    const render = createRenderLoop(
      device,
      context,
      pipeline,
      vertexBuffer,
      indexBuffer,
      uniformBindGroup,
      updateUniform,
      vertexCount
    );
    
    // アニメーションの開始
    render();
    
  } catch (error) {
    console.error("Error initializing WebGPU:", error);
    app.innerHTML = `
      <div class="error">
        <h1>Error</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}

// メイン処理の実行
main();

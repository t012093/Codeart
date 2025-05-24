export async function initializeWebGPU(canvas: HTMLCanvasElement) {
  // WebGPUのサポートを確認
  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported on this browser.");
  }

  // アダプタを要求
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("No appropriate GPUAdapter found.");
  }

  // デバイスを要求
  const device = await adapter.requestDevice();

  // キャンバスのコンテキスト取得とフォーマット
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const format = navigator.gpu.getPreferredCanvasFormat();

  // キャンバスの設定
  context.configure({
    device,
    format,
    alphaMode: "premultiplied",
  });

  // ウィンドウのリサイズに対応
  const handleResize = () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  return { device, context, format };
}

struct Uniforms {
  time: f32,
  _pad: f32,
  resolution: vec2<f32>
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

fn palette(t: f32) -> vec3<f32> {
  let a = vec3<f32>(0.5, 0.5, 0.5);
  let b = vec3<f32>(0.5, 0.5, 0.5);
  let c = vec3<f32>(1.0, 1.0, 1.0);
  let d = vec3<f32>(0.263, 0.416, 0.557);

  return a + b * cos(6.28318 * (c * t + d));
}

@fragment
fn main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = (fragCoord.xy * 2.0 - uniforms.resolution) / uniforms.resolution.y;
  let uv0 = uv;
  var finalColor = vec3<f32>(0.0);
  
  var uvt = uv;
  for (var i: f32 = 0.0; i < 4.0; i = i + 1.0) {
    // fract in WGSL
    uvt = fract(uvt * 1.5) - 0.5;

    var d = length(uvt) * exp(-length(uv0));
    
    let col = palette(length(uv0) + i * 0.4 + uniforms.time * 0.4);
    
    d = sin(d * 8.0 + uniforms.time) / 8.0;
    d = abs(d);
    
    d = pow(0.01 / d, 1.2);
    
    finalColor = finalColor + col * d;
  }
  
  return vec4<f32>(finalColor, 1.0);
}

precision highp float;
uniform vec2 uResolution; // in pixel
uniform float uTime; // in s
uniform vec2 uTextureSize; // size of texture
uniform sampler2D uTexture; // texture

in vec2 vUv; // 0 (left) 0 (bottom) - 1 (right) 1 (top)
// in vec2 vUvCover;

out vec4 outColor;


void main() {
  // texture
  vec3 texture = vec3(texture2D(uTexture, vUv));

  // output
  outColor = vec4(texture, 1.0);
}

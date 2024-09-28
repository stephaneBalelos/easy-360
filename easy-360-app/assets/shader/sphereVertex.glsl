uniform vec2 uResolution; // in pixel
uniform float uTime; // in s
uniform vec2 uTextureSize; // size of texture
uniform sampler2D uTexture; // texture


#include './resources/utils.glsl';
#include './resources/noise.glsl';


out vec2 vUv;  // 0 (left) 0 (bottom) - 1 (top) 1 (right)
// out vec2 vUvCover;


void main() {
  vUv = uv;
  // vUvCover = getCoverUvVert(uv, uTextureSize, uQuadSize);

  // wave based on x

  // output
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
float PI = 3.14159265359;

void main() {
  vUv = (uv - vec2(0.5)) * 0.9 + vec2(0.5);
  vec3 pos = position;
  pos.y += sin(time * 0.3) * 0.025;
  vUv.y -= sin(time * 0.3) * 0.025;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
attribute float aRandom;

uniform float uTime;

varying vec2 vUv;

void main() {
    vec3 pos = position;
    pos += aRandom*sin(0.5*sin(uTime)+0.5) * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}

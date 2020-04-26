precision mediump float;

attribute vec3 vertPos;
attribute vec2 texCoord;
// attribute vec3 vertNorm;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 f_texCoord;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertPos, 1.0);
    f_texCoord = texCoord;
}

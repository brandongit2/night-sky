precision mediump float;

varying vec2 f_texCoord;

uniform sampler2D textureUnit;

void main() {
    gl_FragColor = texture2D(textureUnit, f_texCoord);
}

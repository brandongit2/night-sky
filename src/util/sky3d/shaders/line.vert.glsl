precision mediump float;

attribute vec3 vertPos;
attribute vec3 vertColor;
attribute vec3 prevVert;
attribute vec3 nextVert;
attribute float lineSide;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float opacity;
uniform vec2 windowSize;
uniform float lineWidth;

varying vec4 fragColor;

void main() {
    mat4 mvp = projectionMatrix * viewMatrix * modelMatrix;
    vec4 transformed = mvp * vec4(vertPos, 1.0);
    vec4 prevTransformed = mvp * vec4(prevVert, 1.0);
    vec4 nextTransformed = mvp * vec4(nextVert, 1.0);
    
    vec2 vPrev = (transformed.xy / transformed.w - prevTransformed.xy / prevTransformed.w) * windowSize;
    vec2 vNext = (nextTransformed.xy / nextTransformed.w - transformed.xy / transformed.w) * windowSize;
    
    vec2 normal = normalize(vec2(-vPrev.y, vPrev.x));
    if (vPrev.x > -0.01 && vPrev.x < 0.01 && vPrev.y > -0.01 && vPrev.y < 0.01) {
        normal = normalize(vec2(-vNext.y, vNext.x));
        vPrev = vNext;
    } else if (vNext.x > -0.01 && vNext.x < 0.01 && vNext.y > -0.01 && vNext.y < 0.01) {
        vNext = vPrev;
    }
    
    vec2 tangent = normalize(vPrev) + normalize(vNext); // tangent has the average angle of vPrev and vNext
    vec2 miter = normalize(vec2(-tangent.y, tangent.x)); // Rotate tangent counter-clockwise 90 degrees
    
    miter *= lineWidth / dot(miter, normal);
    miter *= transformed.w;
    miter /= windowSize;
    if (lineSide > 1.5) miter *= -1.0;
    
    vec4 offset = vec4(miter, 0.0, 0.0);
    
    gl_Position = transformed + offset;
    fragColor = vec4(vertColor, opacity);
}

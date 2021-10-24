#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform vec4 u_Color; // The color with which to render this instance of geometry.

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;
in vec4 fs_Pos;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.
const vec4 fogColor = vec4(0.7882, 0.6471, 0.6471,1.0);
const float fogAmount= 0.5; 
void main()
{
    float v_fogDepth = length(fs_Pos);
    float fogAmount = smoothstep(20.0, 32.0, v_fogDepth);
    // Material base color (before shading)
    vec4 col = vec4(0.1922, 0.0588, 0.0078, 1.0);
    
    out_Col = mix(col,fogColor,fogAmount);
}

#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;
out vec4 out_Col;
in vec2 fs_UV;

in vec4 fs_LightVec;

uniform sampler2D u_Text;

const vec4 fogColor = vec4(0.7882, 0.6471, 0.6471,1.0);
const float fogAmount= 0.5; 

void main()
{
    
    float v_fogDepth = length(fs_Pos);
    float fogAmount = smoothstep(20.0, 32.0, v_fogDepth);
    // load texture 
    vec3 k_d = texture(u_Text, fs_UV).xyz;
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
    diffuseTerm = abs(diffuseTerm);
    diffuseTerm = clamp(diffuseTerm, 0.f, 1.f);

    float ambientTerm = 0.5;

    float lightIntensity = diffuseTerm + ambientTerm;

    vec4 col = vec4(k_d.rgb*lightIntensity,1.0);

    out_Col = mix(col,fogColor,fogAmount);
}

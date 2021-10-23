#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;
out vec4 out_Col;
in vec2 fs_UV;

in vec4 fs_LightVec;

uniform sampler2D u_Text;


void main()
{
    
    // load texture 
    vec3 k_d = texture(u_Text, fs_UV).xyz;
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
    diffuseTerm = abs(diffuseTerm);
    diffuseTerm = clamp(diffuseTerm, 0.f, 1.f);

    float ambientTerm = 0.3;

    float lightIntensity = diffuseTerm + ambientTerm;

    out_Col = vec4(k_d.rgb*lightIntensity,1.0);
}

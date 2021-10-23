import {vec3,vec4,mat4} from 'gl-matrix'

export class DrawingRule{
    pos : vec3;
    up : vec3;
    look : vec3;
    right : vec3;
    depth : number = 0;
    transform : mat4;
    fixsteps : number = 1.3;
    steps:number = 1.3;

    constructor(pos:vec3 = vec3.fromValues(0,0,0),
                up:vec3 = vec3.fromValues(0,1,0),
                look :vec3 = vec3.fromValues(0,0,1),
                right : vec3 = vec3.fromValues(1,0,0)){
        this.pos = pos;
        this.up = up;
        this.look = look;
        this.right = right;
        this.transform = mat4.fromValues(1,0,0,0,
                                        0,1,0,0,
                                        0,0,1,0,
                                        0,0,0,1)
    }

}
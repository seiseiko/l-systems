import {vec3,vec4,mat4,quat} from 'gl-matrix'

import Turtle from './Turtle';

export class InstanceInfo{
    trans: number[]=[];
    quat:number[]=[];
    scale:number[]=[];
    count:number=0;
};

export class DrawingRule{
    // instance info for l-system rendering
    branch_info:InstanceInfo= new InstanceInfo();
    leaf_info:InstanceInfo = new InstanceInfo();
    
    turtles:Array<Turtle> = new Array(); // turtle stack
    current_turtle:Turtle;
    drawingRule: Map<string, any> = new Map();// map character to drawing functions

    constructor(){
        console.log("drawingRule created");


        // set up the turtle
        let t = new Turtle(vec3.fromValues(0.,0.,0.), // position
                    vec3.fromValues(0,1,0), // aim
                    vec3.fromValues(1,1,1), //scale
                    0.18, //step
                    vec3.fromValues(0,1,0), //up
                    quat.fromValues(0,0,0,1), //quat
                    0); //level

                    
        console.log("current turtle",t);
        
        this.turtles.push(t);

        this.current_turtle = this.turtles[0];
        
        console.log("current turtle",this.turtles[0]);
        
        // set up drawing rule map
        this.drawingRule.set('F', this.drawForward.bind(this));
    };      

    draw(grammar:string){
        console.log("DrawingRule starts to draw:");
        
        for (let i = 0; i < grammar.length; i++) {
            if(this.current_turtle.scale[0]<0.02){
                continue; // prevent infinite growing
            }
            let draw_func = this.drawingRule.get(grammar.charAt(i));
            draw_func();
        }
    }

    // drawing function
    // F - move forward
    drawForward(){
       let t = this.current_turtle;
       console.log("moving forward",t.position);

       t.scale[0] *= 0.98;
       t.scale[1] *= 0.98;
       t.scale[2] *= 0.98;

       this.branch_info.scale.push(t.scale[0],t.scale[1],t.scale[2]);
       this.branch_info.quat.push(t.quaternion[0],t.quaternion[1],t.quaternion[2],t.quaternion[3]);
       this.branch_info.trans.push(t.position[0],t.position[1],t.position[2]);
       this.branch_info.count++;

       t.forward();
       
       console.log("moving forward after",t.position);
    }

}

export default DrawingRule;
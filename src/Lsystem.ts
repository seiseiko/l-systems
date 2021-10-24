import {vec3,vec4,mat4} from 'gl-matrix'
import { ExpansionRule } from './ExpansionRule';
import { InstanceInfo,DrawingRule } from './DrawingRule';
import Cylinder from './geometry/Cylinder';
import Leaf from './geometry/Leaf';


class Lsystem {
        
    expansionRule:ExpansionRule;
    drawingRule:DrawingRule;

    // mesh obj to render
    leaf_mesh: Leaf;
    cylinder_mesh:Cylinder;


    constructor(){
        console.log("lsystem created");
        this.expansionRule = new ExpansionRule("F"); // input axiom
        this.drawingRule = new DrawingRule();
        this.load_mesh();
    };      


    // main function --- call to expand axiom & update vbo to render
    draw(iter:number){
        // 1. get expanded result string
        this.expansionRule.expand(iter);
        let grammar = this.expansionRule.expanded_string;
        // 2. Main loop to eval grammar inside drawingrule.draw
        // ************** update instance info inside drawing rule   
        this.drawingRule.draw(grammar);
        // 3. Set up instance VBO for leaf & cylinder
        this.update_vbo(this.drawingRule.leaf_info,this.leaf_mesh);
        this.update_vbo(this.drawingRule.branch_info,this.cylinder_mesh);        
    }

    update_vbo(instance:InstanceInfo,obj:any){
        // setting up the vbo using instance info from drawing rule
        let trans = new Float32Array(instance.trans);
        let quat = new Float32Array(instance.quat);
        let scale = new Float32Array(instance.scale);
        console.log(instance.trans);
        console.log(instance.quat);
        console.log(instance.scale);
        obj.setInstanceVBOs(trans,quat,scale);
        obj.setNumInstances(instance.count);

    }

    // load mesh from files
    load_mesh(){
        this.leaf_mesh = new Leaf("./src/obj/leaf.obj", "/src/obj/red-maple-leaf.jpg");
        this.leaf_mesh.create();
        this.cylinder_mesh = new Cylinder("./src/obj/cylinder.obj", "/src/obj/red-maple-leaf.jpg");
        this.cylinder_mesh.create();
    }

}


export default Lsystem;
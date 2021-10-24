import {vec3,vec4,mat4} from 'gl-matrix'
import { stringify } from 'querystring';


export class ExpansionRule {
    expansionRule: Map<string, any> = new Map();
    axiom: string;
    expanded_string: string;

    constructor(axiom : string) {
        this.axiom = axiom;
        // set up expansion rule
        this.expansionRule.set('F', this.F.bind(this));
        this.expansionRule.set('X', this.X.bind(this));
    }

    // Rules with probability
    F() {
        let rand = Math.random();
        if (rand < 0.2) return 'FF';    // 20%
        else return 'FFFFF';             // 80%
    }

    X() { 
        let rand = Math.random();
        if (rand < 0.3) return '[FX][*+FX]'  // 30%
        else return '[+FX][*+FX][**+FX]';    // 70%
    }

    // expand single character
    expand_char(char_to_expand: string) {
        let expanded = this.expansionRule.get(char_to_expand);
        return expanded ? expanded() : char_to_expand;
    }

    // expand the axiom and save result.
    expand(iter:number){

       let res : string = this.axiom;
       for(let i = 0; i < iter; i++){
           let temp:string = "";
           for(let letter of res){
              temp+=this.expand_char(letter);
           }
           
           res = temp;
        }
        console.log("string expanded:",res);
        this.expanded_string = res;
        
    }

};

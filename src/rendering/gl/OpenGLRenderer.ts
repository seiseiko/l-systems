import {mat4, vec4, mat3} from 'gl-matrix';
import Drawable from './Drawable';
import Camera from '../../Camera';
import {gl} from '../../globals';
import ShaderProgram from './ShaderProgram';
import { scene_control } from '../../main';

// In this file, `gl` is accessible because it is imported above
class OpenGLRenderer {
  constructor(public canvas: HTMLCanvasElement) {
  }

  setClearColor(r: number, g: number, b: number, a: number) {
    gl.clearColor(r, g, b, a);
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  render(camera: Camera, prog: ShaderProgram, drawables: Array<Drawable>) {
    let model = mat4.create();
    let viewProj = mat4.create();
    let color = vec4.fromValues(1, 0, 0, 1);
    // Each column of the axes matrix is an axis. Right, Up, Forward.
    let axes = mat3.fromValues(camera.right[0], camera.right[1], camera.right[2],
                               camera.up[0], camera.up[1], camera.up[2],
                               camera.forward[0], camera.forward[1], camera.forward[2]);


    prog.setEyeRefUp(camera.controls.eye, camera.controls.center, camera.controls.up);
    mat4.identity(model);
    mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);
    prog.setModelMatrix(model);
    prog.setViewProjMatrix(viewProj);
    prog.setCameraAxes(axes);
    prog.setFogColor(scene_control.depth_fog_color);
    for (let drawable of drawables) {
      
      if (drawable.bindTex()){
        prog.setText(drawable.getTex());
        //console.log(drawable);
      }
      prog.draw(drawable);
    }
  }
};

export default OpenGLRenderer;

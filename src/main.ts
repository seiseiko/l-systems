import {vec2,vec3,quat} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import Cylinder from './geometry/Cylinder';
import Mesh from './geometry/Mesh';
import Leaf from './geometry/Leaf';
import Cube from './geometry/Cube';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { generateRandomNumber, setGL } from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Lsystem from './Lsystem';
import Drawable from './rendering/gl/Drawable';
import Plane from './geometry/plane';
import { leaf_floor, InstanceInfo } from './DrawingRule';
// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
};

let time: number = 0.0;
let m : Mesh; // Mesh for testing
let leaf : Leaf[]=[];
let c : Cylinder;
let p : Plane;
let l_system: Lsystem[] =[];
let mesh_array_branch:Array<Drawable> = [];
let mesh_array_leaf:Array<Drawable> = [];
let screen : ScreenQuad; // Mesh for testing

function loadScene() {

  // set up lsystem
  l_system[0] = new Lsystem(vec3.fromValues(0,0,-3));
  l_system[1] = new Lsystem(vec3.fromValues(8,0,-8));
  l_system[2] = new Lsystem(vec3.fromValues(18,0,-15));
  l_system[3] = new Lsystem(vec3.fromValues(-8,-2,5));
  l_system[4] = new Lsystem(vec3.fromValues(-15,0,-5));
  l_system[5] = new Lsystem(vec3.fromValues(-12,0,-10));
  l_system[6] = new Lsystem(vec3.fromValues(-3,0,-15));
  l_system[7] = new Lsystem(vec3.fromValues(0,0,-23));
  l_system[8] = new Lsystem(vec3.fromValues(6,0,-22));
  l_system[9] = new Lsystem(vec3.fromValues(8,0,-24));
  for(var l of l_system){
    l.draw(8);
    mesh_array_branch.push(l.cylinder_mesh);
    mesh_array_leaf.push(l.leaf_mesh_red);
    mesh_array_leaf.push(l.leaf_mesh_green);
    mesh_array_leaf.push(l.leaf_mesh_orange);
  }  


  // background
  // plane
  p = new Plane(vec3.fromValues(0,-0.1,0), vec2.fromValues(450,450), 20);
  p.create();
  p.setNumInstances(1);
  // screen
  screen = new ScreenQuad();
  screen.create();
  screen.setNumInstances(1);
  leaf[0] = new Leaf("./src/obj/leaf.obj", "/src/obj/red-maple-leaf.jpg");
  leaf[0].create();
  let info = new InstanceInfo();
  leaf_floor(info,leaf[0],10000);
  leaf[1] = new Leaf("./src/obj/leaf.obj", "/src/obj/orange.jpg");
  leaf[1].create();
  info = new InstanceInfo();
  leaf_floor(info,leaf[1],10000);
  leaf[2] = new Leaf("./src/obj/leaf.obj", "/src/obj/dead.jpg");
  leaf[2].create();
  info = new InstanceInfo();
  leaf_floor(info,leaf[2],10000);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(50,50,50), vec3.fromValues(0, 5, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);
  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);
  const leaf_shader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/leaf-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/leaf-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    leaf_shader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screen]);
    renderer.render(camera, instancedShader, mesh_array_branch);
    renderer.render(camera, leaf_shader, mesh_array_leaf);
    renderer.render(camera,lambert, [p]);
    renderer.render(camera, instancedShader, leaf);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();

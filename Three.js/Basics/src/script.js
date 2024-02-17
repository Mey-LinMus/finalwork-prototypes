import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

/**
 * Position
 */
// mesh.position.x = 1;
// mesh.position.y = 1;
// mesh.position.z = -1;

// Shorter version from above
// mesh.position.set(1, 1, -1);

// mesh.position.normalize()

scene.add(mesh);

// console.log(mesh.position.length());

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

/**
 * Animations
 */

// Time
let time = Date.now();

const anim = () => {
  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  console.log(deltaTime);

  // Update objects
  mesh.rotation.y += 0.001 * deltaTime;

  //  Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(anim);
};

anim();

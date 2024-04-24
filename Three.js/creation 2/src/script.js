import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 300000;
parameters.size = 0.01;
parameters.radius = 13;
parameters.branches = 20;
parameters.spin = 0.5;
parameters.randomness = 0.16;
parameters.randomnessPower = 2;
parameters.insideColor = "#5153e1";
parameters.outsideColor = "#5e20cf";

let geometry = null;
let material = null;
let points = null;

const generateCube = () => {
  // Destroy old galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

   /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(8 * 3); // 8 vertices for a cube
  const colors = new Float32Array(8 * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  // Define cube vertices
  const cubeVertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];

  for (let i = 0; i < 8; i++) {
    const i3 = i * 3;

    positions[i3] = cubeVertices[i][0];
    positions[i3 + 1] = cubeVertices[i][1];
    positions[i3 + 2] = cubeVertices[i][2];

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, (i + 1) / 2); // Adjust the color blending based on vertex index

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

gui.addColor(parameters, "insideColor").onFinishChange(generateCube);
gui.addColor(parameters, "outsideColor").onFinishChange(generateCube);

generateCube();
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 10;
camera.position.z = 0;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const rotateCamera = () => {
  gsap.to(camera.rotation, {
    z: Math.PI * 2, // Rotate 360 degrees around the y-axis
    duration: 50, // Duration of the rotation animation in seconds
    ease: "linear", // Linear easing for a constant rotation speed
  });
};

const startRotation = () => {
  rotateCamera();
};

startRotation();

const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

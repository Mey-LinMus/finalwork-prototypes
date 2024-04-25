import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const StereoEffectScene = () => {
  // Reference to the container element
  const containerRef = useRef(null);
  // References to store mouse position
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  // Calculating half of window width and height
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  // Reference to store spheres
  const spheres = useRef([]);

  useEffect(() => {
    let camera, scene, renderer, effect;

    const init = () => {
      const container = containerRef.current;
      // Creating a perspective camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.z = 3200;

      // Creating a scene
      scene = new THREE.Scene();
      // Loading a cube texture as background
      scene.background = new THREE.CubeTextureLoader()
        .setPath("textures/cube/Park3Med/")
        .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

      // Creating a sphere geometry
      const geometry = new THREE.SphereGeometry(100, 32, 16);

      // Loading cube texture for environment mapping
      const textureCube = new THREE.CubeTextureLoader()
        .setPath("textures/cube/Park3Med/")
        .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
      textureCube.mapping = THREE.CubeRefractionMapping;

      // Creating a basic material with environment mapping
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube,
        refractionRatio: 0.95,
      });

      // Creating and adding spheres to the scene
      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add(mesh);
        spheres.current.push(mesh);
      }

      // Creating a WebGL renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Creating a stereo effect
      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);

      // Event listeners for resizing window and mouse movement
      window.addEventListener("resize", onWindowResize);
      document.addEventListener("mousemove", onDocumentMouseMove);
    };

    const onWindowResize = () => {
      // Adjusting camera aspect ratio and effect size on window resize
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    const onDocumentMouseMove = (event) => {
      // Updating mouse position on mouse movement
      mouseX.current = (event.clientX - windowHalfX) * 10;
      mouseY.current = (event.clientY - windowHalfY) * 10;
    };

    const animate = () => {
      // Recursive animation function
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      // Rendering function
      const timer = 0.0001 * Date.now();

      // Updating camera position based on mouse movement
      camera.position.x += (mouseX.current - camera.position.x) * 0.05;
      camera.position.y += (-mouseY.current - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Moving spheres in a circular pattern
      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }

      // Rendering scene with stereo effect
      effect.render(scene, camera);
    };

    // Initializing the scene and starting animation
    init();
    animate();

    // Clean up function
    return () => {
      // Removing event listeners and renderer's DOM element on unmount
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  // Returning a div container for the scene
  return <div ref={containerRef} id="info"></div>;
};

export default StereoEffectScene;

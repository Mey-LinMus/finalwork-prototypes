import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";

const StereoEffectScene = () => {
  const containerRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;
  const spheres = useRef([]);

  useEffect(() => {
    let camera, scene, renderer, effect;

    const init = () => {
      const container = containerRef.current;
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
      );
      camera.position.z = 3200;

      scene = new THREE.Scene();
      scene.background = new THREE.CubeTextureLoader()
        .setPath("textures/cube/Park3Med/")
        .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

      const geometry = new THREE.SphereGeometry(100, 32, 16);

      const textureCube = new THREE.CubeTextureLoader()
        .setPath("textures/cube/Park3Med/")
        .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);
      textureCube.mapping = THREE.CubeRefractionMapping;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube,
        refractionRatio: 0.95,
      });

      for (let i = 0; i < 500; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add(mesh);
        spheres.current.push(mesh);
      }

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      effect = new StereoEffect(renderer);
      effect.setSize(window.innerWidth, window.innerHeight);

      window.addEventListener("resize", onWindowResize);
      document.addEventListener("mousemove", onDocumentMouseMove);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      effect.setSize(window.innerWidth, window.innerHeight);
    };

    const onDocumentMouseMove = (event) => {
      mouseX.current = (event.clientX - windowHalfX) * 10;
      mouseY.current = (event.clientY - windowHalfY) * 10;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      const timer = 0.0001 * Date.now();

      camera.position.x += (mouseX.current - camera.position.x) * 0.05;
      camera.position.y += (-mouseY.current - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      for (let i = 0, il = spheres.current.length; i < il; i++) {
        const sphere = spheres.current[i];
        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
      }

      effect.render(scene, camera);
    };

    init();
    animate();

    // Clean up function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} id="info"></div>;
};

export default StereoEffectScene;

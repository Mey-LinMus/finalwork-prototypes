import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton";

const VRScene = () => {
  const sceneRef = useRef();
  const vrButtonContainerRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    camera.position.z = 5;

    const animate = () => {
      renderer.setAnimationLoop(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      });
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    vrButtonContainerRef.current.appendChild(VRButton.createButton(renderer));

    sceneRef.current.appendChild(renderer.domElement);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.setAnimationLoop(null);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={sceneRef} />
      <div ref={vrButtonContainerRef} />
    </>
  );
};

export default VRScene;

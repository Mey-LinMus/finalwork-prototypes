// ThreeComponent.js
import React, { useRef } from "react";
import { View } from "react-native";
import { Canvas } from "react-three-fiber";
import { Box } from "react-three-fiber/drei";

const ThreeComponent = () => {
  const cubeRef = useRef();

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box ref={cubeRef} scale={[2, 2, 2]}>
          <meshBasicMaterial attach="material" color="blue" />
        </Box>
      </Canvas>
    </View>
  );
};

export default ThreeComponent;

"use client";

import { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Group, Box3, Vector3, TextureLoader, DoubleSide } from "three";

function Logo() {
  const texture = useLoader(TextureLoader, "/model/billboard/ai-design-1731172054366.png");

  return (
    <mesh
      position={[-0.14, 1, -0.654]} // Minimal Z offset to prevent z-fighting
      rotation={[-0.2, 0, 0]}
    >
      <planeGeometry args={[2.27, 0.91]} />
      <meshStandardMaterial 
        map={texture}
        transparent={true}
        side={DoubleSide}
        alphaTest={0.5}
        // Add these properties to better attach to the t-shirt
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}

function MeshComponent() {
  const fileUrl = "/model/billboard/scene.gltf";
  const groupRef = useRef<Group>(null!);
  const modelRef = useRef<Group>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  useEffect(() => {
    if (gltf.scene) {
      // Center the model's pivot point
      const box = new Box3().setFromObject(gltf.scene);
      const center = new Vector3();
      box.getCenter(center);
      gltf.scene.position.sub(center);

      // Store reference to the model
      modelRef.current = gltf.scene;
    }
  }, [gltf]);

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
      {/* Place the logo as a child of the specific mesh in the t-shirt model */}
      <group position={[0.14, -0.34, 0.25]} rotation={[0.2, 0, 0]}>
        <Logo />
      </group>
    </group>
  );
}

export default function Hoding() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Canvas 
        className="h-2xl w-2xl"
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "#f0f0f0", width: "1700px", height: "1150px" }}
      >
        <OrbitControls enableZoom={true} enablePan={true} />
        <Environment preset="warehouse" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <MeshComponent />
      </Canvas>
    </div>
  );
}
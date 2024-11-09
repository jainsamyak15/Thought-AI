"use client";

import { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Group, Box3, Vector3, TextureLoader, DoubleSide } from "three";
import { useRouter } from "next/router";

// Interface for the generated image
interface GeneratedImage {
  id: string;
  created_at: string;
  image_url: string;
  type: "logo" | "banner";
  prompt: string;
}

// Logo component to load and display the texture on a plane
function Logo({ textureUrl }: { textureUrl: string }) {
  const texture = useLoader(TextureLoader, textureUrl);

  return (
    <mesh
      position={[-0.1, -0.13, -0.13]} // Minimal Z offset to prevent z-fighting
      rotation={[-0.6, 0, 0]}
    >
      <planeGeometry args={[0.07, 0.07]} />
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

// Mesh component to load the 3D model and apply the logo texture
function MeshComponent({ textureUrl }: { textureUrl: string }) {
  const fileUrl = "/model/oversized_t-shirt.glb"; // Path to the 3D model
  const groupRef = useRef<Group>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl); // Loading the 3D model

  // Adjust the position of the model to center it
  useEffect(() => {
    if (gltf.scene) {
      const box = new Box3().setFromObject(gltf.scene);
      const center = new Vector3();
      box.getCenter(center);
      gltf.scene.position.sub(center); // Center the 3D model
    }
  }, [gltf]);

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
      {/* Position the logo on the billboard */}
      <group position={[0.18, 0.3, 0.24]} rotation={[0.2, 0, 0]}>
        <Logo textureUrl={textureUrl} />
      </group>
    </group>
  );
}

// Main component to display the 3D scene
export default function Holding() {
  const router = useRouter();
  const { imageUrl } = router.query as { imageUrl: string }; // Extract image URL from the query

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
        {/* Render the MeshComponent if the imageUrl is available */}
        {imageUrl && <MeshComponent textureUrl={imageUrl} />}
      </Canvas>
    </div>
  );
}

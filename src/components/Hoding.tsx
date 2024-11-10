"use client";

import { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Group, Box3, Vector3, TextureLoader, DoubleSide } from "three";
import { useRouter } from "next/router";

interface GeneratedImage {
  id: string;
  created_at: string;
  image_url: string;
  type: "logo" | "banner";
  prompt: string;
}

function Logo({ textureUrl }: { textureUrl: string }) {
  const texture = useLoader(TextureLoader, textureUrl);

  return (
    <mesh position={[-0.14, 1, -0.654]} rotation={[-0.2, 0, 0]}>
      <planeGeometry args={[2.27, 0.91]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        side={DoubleSide}
        alphaTest={0.5}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}

function MeshComponent({ textureUrl }: { textureUrl: string }) {
  const fileUrl = "/model/billboard/scene.gltf";
  const groupRef = useRef<Group>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  useEffect(() => {
    if (gltf.scene) {
      const box = new Box3().setFromObject(gltf.scene);
      const center = new Vector3();
      box.getCenter(center);
      gltf.scene.position.sub(center);
    }
  }, [gltf]);

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
      <group position={[0.14, -0.34, 0.25]} rotation={[0.2, 0, 0]}>
        <Logo textureUrl={textureUrl} />
      </group>
    </group>
  );
}

export default function Hoding() {
  const router = useRouter();
  const { imageUrl } = router.query as { imageUrl: string };

  return (
    <div className="flex justify-center items-center h-screen">
      <Canvas
        className="h-[80px] w-[1200px] bg-[#151515]"
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "#f0f0f0", width: "1700px", height: "1150px" }}
      >
        <OrbitControls enableZoom={true} enablePan={true} />
        <Environment preset="warehouse" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        {imageUrl && <MeshComponent textureUrl={imageUrl} />}
      </Canvas>
    </div>
  );
}

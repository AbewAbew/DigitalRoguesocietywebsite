import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const RotatingCore = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group>
            {/* Wireframe Outer Shell */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[3, 1]} />
                <meshStandardMaterial wireframe color="#0044ff" emissive="#0044ff" emissiveIntensity={0.5} transparent opacity={0.4} />
            </mesh>
            {/* Inner Glowing Core */}
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial color="#000" emissive="#0044ff" emissiveIntensity={2} toneMapped={false} />
            </mesh>
             {/* Orbiting Rings */}
             <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[5, 0.05, 16, 100]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} />
            </mesh>
             <mesh rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[6, 0.05, 16, 100]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
            </mesh>
        </group>
    );
};

interface FloatingShapeProps {
  position: [number, number, number];
  vec?: THREE.Vector3;
  color: string;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ position, vec = new THREE.Vector3(), color }) => {
    const api = useRef<RapierRigidBody>(null);
    
    useFrame((state, delta) => {
        // Apply a gentle force towards the center if too far out to keep them in view
        if (api.current) {
             const pos = api.current.translation();
             const dist = Math.sqrt(pos.x**2 + pos.y**2 + pos.z**2);
             if (dist > 12) {
                 const dir = vec.set(-pos.x, -pos.y, -pos.z).normalize().multiplyScalar(20 * delta);
                 api.current.applyImpulse(dir, true);
             }
        }
    });

    return (
        <RigidBody 
            ref={api} 
            position={position} 
            colliders="cuboid" 
            linearDamping={1} 
            angularDamping={1}
            restitution={0.8}
        >
            <mesh>
                <boxGeometry args={[Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.1} metalness={0.9} />
            </mesh>
        </RigidBody>
    );
};

const GeometricCloud = () => {
  const count = 30;
  const shapes = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 5
      ] as [number, number, number],
      color: Math.random() > 0.4 ? "#0044ff" : "#ffffff"
    }));
  }, []);

  return (
    <>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} position={shape.position} color={shape.color} />
      ))}
    </>
  );
};

const Lights = () => {
    const lightRef = useRef<THREE.PointLight>(null);
    useFrame(({ mouse }) => {
        if (lightRef.current) {
            lightRef.current.position.x = (mouse.x * 10);
            lightRef.current.position.y = (mouse.y * 10);
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight ref={lightRef} position={[0, 0, 5]} intensity={20} color="#3b82f6" distance={15} decay={2} />
            <pointLight position={[-10, 10, -5]} intensity={10} color="#ffffff" />
            <pointLight position={[10, -10, -5]} intensity={5} color="#0044ff" />
        </>
    )
}

const CanvasBackground: React.FC = () => {
  return (
    <div id="canvas-container">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />
        <color attach="background" args={['#020617']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        <fog attach="fog" args={['#020617', 10, 45]} />
        
        <Lights />
        
        <Physics gravity={[0, 0, 0]}>
           <RotatingCore />
           <GeometricCloud />
        </Physics>
      </Canvas>
    </div>
  );
};

export default CanvasBackground;
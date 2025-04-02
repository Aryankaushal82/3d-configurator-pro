
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useGLTF, useTexture, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useConfigurator } from '../contexts/ConfiguratorContext';
import { MeshStandardMaterial } from 'three';
import { Circles } from 'react-loader-spinner';

// GLTFResult type for model loading
type GLTFResult = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
  scene: THREE.Group;
};

// Component to load and display the 3D model
const FurnitureModel: React.FC = () => {
  const { state } = useConfigurator();
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // For development, we'll simulate loading models
  // In production, these would be actual model paths
  const mainModelPath = '/models/603-02.glb';
  const handlePath1 = '/models/603-02-hardware-1.glb';
  const handlePath2 = '/models/603-02-hardware-2.glb';
  const legPathA = '/models/Leg-A.glb';
  const legPathB = '/models/Leg-B.glb';
  
  // We're simulating model loading here
  // In a real app, you'd use useGLTF to load actual models
  const mainModel = { scene: useRef(new THREE.Group()).current };
  const handle1 = { scene: useRef(new THREE.Group()).current };
  const handle2 = { scene: useRef(new THREE.Group()).current };
  const legA = { scene: useRef(new THREE.Group()).current };
  const legB = { scene: useRef(new THREE.Group()).current };
  
  // Create a simulated material for our model
  const [material, setMaterial] = useState<THREE.MeshStandardMaterial | null>(null);
  
  // Update material when selected material changes
  useEffect(() => {
    if (state.selectedMaterial) {
      const newMaterial = new MeshStandardMaterial({
        color: state.selectedMaterial.color,
        metalness: state.selectedMaterial.category === 'ALUMINIUM' ? 0.8 : 0.1,
        roughness: state.selectedMaterial.category === 'ALUMINIUM' ? 0.2 : 0.7,
      });
      
      setMaterial(newMaterial);
    }
  }, [state.selectedMaterial]);
  
  // Position camera on mount
  useEffect(() => {
    if (camera) {
      camera.position.set(2, 1, 2);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);
  
  // Rotate model slightly on each frame
  useFrame(() => {
    if (groupRef.current) {
      // Very subtle automatic rotation when not interacting
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Create a placeholder box for our furniture
  const furnitureGeometry = useMemo(() => new THREE.BoxGeometry(1.5, 0.6, 0.8), []);
  
  // Create two placeholders for the legs
  const legGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.2, 0.1), []);
  
  // Create placeholder for handles
  const handleGeometry = useMemo(() => new THREE.CylinderGeometry(0.02, 0.02, 0.2), []);
  
  return (
    <group ref={groupRef}>
      {/* Main furniture body */}
      <mesh geometry={furnitureGeometry} position={[0, 0.3, 0]}>
        {material && <primitive object={material} attach="material" />}
      </mesh>
      
      {/* Legs */}
      {state.selectedLeg === 'Leg A' ? (
        <>
          <mesh geometry={legGeometry} position={[-0.6, 0, 0.3]} material={material} />
          <mesh geometry={legGeometry} position={[0.6, 0, 0.3]} material={material} />
          <mesh geometry={legGeometry} position={[-0.6, 0, -0.3]} material={material} />
          <mesh geometry={legGeometry} position={[0.6, 0, -0.3]} material={material} />
        </>
      ) : (
        <>
          <mesh geometry={legGeometry} position={[-0.6, 0, 0]} material={material} />
          <mesh geometry={legGeometry} position={[0.6, 0, 0]} material={material} />
        </>
      )}
      
      {/* Handles */}
      {state.selectedHandle === '603-02 Hardware 1' ? (
        <>
          <mesh geometry={handleGeometry} position={[-0.4, 0.3, 0.4]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh geometry={handleGeometry} position={[0.4, 0.3, 0.4]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
        </>
      ) : (
        <>
          <mesh geometry={handleGeometry} position={[-0.4, 0.3, 0.4]} rotation={[0, 0, Math.PI/2]}>
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh geometry={handleGeometry} position={[0.4, 0.3, 0.4]} rotation={[0, 0, Math.PI/2]}>
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </mesh>
        </>
      )}
    </group>
  );
};

// The main 3D canvas component
const Model3D: React.FC = () => {
  const { state } = useConfigurator();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const canvasStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    background: 
      state.backgroundSetting === 'light' 
        ? '#f8f9fa' 
        : state.backgroundSetting === 'dark'
          ? '#212529'
          : 'linear-gradient(to bottom, #e9ecef, #adb5bd)',
  };
  
  return (
    <div 
      className="h-full w-full relative"
      style={{ 
        height: state.isFullscreen ? '100vh' : '100%',
        position: state.isFullscreen ? 'fixed' : 'relative',
        top: state.isFullscreen ? 0 : 'auto',
        left: state.isFullscreen ? 0 : 'auto',
        width: state.isFullscreen ? '100vw' : '100%',
        zIndex: state.isFullscreen ? 50 : 'auto',
      }}
    >
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      ) : (
        <Canvas style={canvasStyle} shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <FurnitureModel />
            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.75}
              scale={10}
              blur={2.5}
              far={4}
            />
            <Environment preset="city" />
          </Suspense>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={7}
          />
        </Canvas>
      )}
    </div>
  );
};

export default Model3D;

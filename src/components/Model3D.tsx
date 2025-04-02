import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Circles } from 'react-loader-spinner';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import FurnitureModel from './FurnitureModel';
import ViewerControls from './ViewerControls';

// This component provides access to the camera and controls
const ControlsExposer = () => {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    // Make camera and controls available to the ViewerControls component
    window.sceneCamera = camera;
    window.sceneControls = controls;
  }, [camera, controls]);
  
  return null;
};

const Model3D = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [background, setBackground] = useState('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Function to be passed to ViewerControls
  const setBackgroundSetting = (setting) => {
    setBackground(setting);
  };

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Add actual fullscreen implementation if needed
  };

  // Provide context values to ViewerControls
  useEffect(() => {
    // Mocking the ConfiguratorContext for ViewerControls
    window.configuratorState = {
      state: {
        backgroundSetting: background,
        isFullscreen: isFullscreen
      },
      setBackgroundSetting: setBackgroundSetting,
      toggleFullscreen: toggleFullscreen
    };
  }, [background, isFullscreen]);

  // Background color based on setting
  const getBackgroundColor = () => {
    switch(background) {
      case 'dark': return '#333333';
      case 'gradient': return 'linear-gradient(to bottom, #4a6fa5, #c4e0e5)';
      default: return '#f5f5f5';
    }
  };

  return (
    <div className={`h-full w-full relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} 
         style={{background: getBackgroundColor()}}>
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
        <>
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <FurnitureModel />
            {/* <axesHelper args={[5]} /> */}
            
            <ContactShadows
              position={[0, -0.1, 0]}
              opacity={0.75}
              scale={10}
              blur={2.5}
              far={4}
            />
            <Environment preset="city" />
            
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true} 
              minDistance={2} 
              maxDistance={7} 
            />
            <ControlsExposer />
          </Canvas>
          
          {/* Position the controls */}
          <div className="absolute top-4 right-4">
            <ViewerControls />
          </div>
        </>
      )}
    </div>
  );
};

export default Model3D;
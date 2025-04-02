
import React from 'react';
import { useConfigurator } from '../contexts/ConfiguratorContext';
import { ZoomIn, ZoomOut, Maximize, Minimize, Sun, Moon, Palette } from 'lucide-react';

const ViewerControls: React.FC = () => {
  const { state, setBackgroundSetting, toggleFullscreen } = useConfigurator();
  
  const handleZoomIn = () => {
    // In a real app, this would communicate with the camera in the 3D scene
    console.log('Zoom in');
    // We'd use a ref to the camera or a function to modify the camera position
  };
  
  const handleZoomOut = () => {
    // In a real app, this would communicate with the camera in the 3D scene
    console.log('Zoom out');
    // We'd use a ref to the camera or a function to modify the camera position
  };
  
  return (
    <div className="configurator-controls space-y-4">
      <button 
        className="flex justify-center items-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        <ZoomIn size={20} />
      </button>
      
      <button 
        className="flex justify-center items-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        <ZoomOut size={20} />
      </button>
      
      <button 
        className="flex justify-center items-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        onClick={toggleFullscreen}
        aria-label={state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {state.isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>
      
      <div className="border-t border-gray-200 pt-4">
        <button 
          className={`flex justify-center items-center w-10 h-10 rounded-full shadow-md hover:bg-gray-100 transition-colors ${state.backgroundSetting === 'light' ? 'bg-blue-100' : 'bg-white'}`}
          onClick={() => setBackgroundSetting('light')}
          aria-label="Light background"
        >
          <Sun size={20} />
        </button>
        
        <button 
          className={`flex justify-center items-center w-10 h-10 rounded-full shadow-md hover:bg-gray-100 transition-colors mt-4 ${state.backgroundSetting === 'dark' ? 'bg-blue-100' : 'bg-white'}`}
          onClick={() => setBackgroundSetting('dark')}
          aria-label="Dark background"
        >
          <Moon size={20} />
        </button>
        
        <button 
          className={`flex justify-center items-center w-10 h-10 rounded-full shadow-md hover:bg-gray-100 transition-colors mt-4 ${state.backgroundSetting === 'gradient' ? 'bg-blue-100' : 'bg-white'}`}
          onClick={() => setBackgroundSetting('gradient')}
          aria-label="Gradient background"
        >
          <Palette size={20} />
        </button>
      </div>
    </div>
  );
};

export default ViewerControls;

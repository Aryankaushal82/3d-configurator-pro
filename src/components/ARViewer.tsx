
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import { useConfigurator } from '../contexts/ConfiguratorContext';

// Add type declaration for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'camera-controls'?: boolean;
          'shadow-intensity'?: string;
          'auto-rotate'?: boolean;
          'ar-scale'?: string;
          'interaction-prompt'?: string;
          alt?: string;
        },
        HTMLElement
      >;
    }
  }
}

// This component will use the model-viewer web component for AR
const ARViewer: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const { state } = useConfigurator();
  const modelViewerRef = useRef<HTMLElement | null>(null);
  
  // QR code value - in a real app, this would be a link to the AR experience
  const qrValue = window.location.href;
  
  // Effect to initialize model-viewer
  useEffect(() => {
    if (visible && modelViewerRef.current) {
      // In a production app, we would set the src attribute to the correct model URL
      // based on the selected options
      modelViewerRef.current.setAttribute('src', '/models/603-02.glb');
      
      // Set up event listeners for model-viewer events
      const handleLoad = () => console.log('Model loaded');
      const handleError = (error: Event) => console.error('Error loading model', error);
      
      modelViewerRef.current.addEventListener('load', handleLoad);
      modelViewerRef.current.addEventListener('error', handleError);
      
      return () => {
        if (modelViewerRef.current) {
          modelViewerRef.current.removeEventListener('load', handleLoad);
          modelViewerRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">View in Your Room</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 h-96">
            <model-viewer
              ref={modelViewerRef}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              shadow-intensity="1"
              auto-rotate
              ar-scale="fixed"
              interaction-prompt="none"
              alt="A 3D model of furniture"
            ></model-viewer>
          </div>
          
          <div className="w-full md:w-1/3 p-6 flex flex-col justify-center items-center">
            <h4 className="text-lg font-medium mb-4">Scan to view on mobile</h4>
            <QRCode value={qrValue} size={200} />
            <p className="text-sm text-gray-500 mt-4 text-center">
              Scan this QR code with your mobile device to view this product in augmented reality.
            </p>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button
            className="w-full py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;


import React, { useState } from 'react';
import { useConfigurator } from '../contexts/ConfiguratorContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Individual color swatch component
const ColorSwatch: React.FC<{
  color: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ color, name, isActive, onClick }) => {
  return (
    <div className="flex flex-col items-center mb-2">
      <button
        className={`swatch ${isActive ? 'active' : ''}`}
        style={{ backgroundColor: color }}
        onClick={onClick}
        aria-label={`Select ${name} color`}
        title={name}
      />
      <span className="text-xs mt-1">{name}</span>
    </div>
  );
};

// Collapsible section component
const ConfigSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  image?: string;
  subtitle?: string;
}> = ({ title, children, isOpen, onToggle, image, subtitle }) => {
  return (
    <div className="configurator-section">
      <div className="configurator-section-header" onClick={onToggle}>
        <div className="flex items-center">
          {image && (
            <div className="w-12 h-12 mr-3">
              <img src={image} alt={title} className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Main configurator panel
const ConfiguratorPanel: React.FC = () => {
  const { state, setSelectedHandle, setSelectedLeg, setSelectedMaterial, materials } = useConfigurator();
  
  // State for section toggles
  const [sections, setSections] = useState({
    handles: true,
    legs: false,
    materials: false,
  });
  
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  // Grouped materials by category
  const materialsByCategory = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);
  
  return (
    <div className="bg-white h-full overflow-y-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Cozy Longe chair</h1>
      <div className="w-32 h-2 bg-gray-200 mb-6"></div>
      
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Customize your Chair
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9H21M9 21V9M15 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </h2>
      
      {/* Handles Selection Section */}
      <ConfigSection
        title="1. Arms"
        subtitle="Fixed Arms"
        isOpen={sections.handles}
        onToggle={() => toggleSection('handles')}
        image="/lovable-uploads/dedfb04e-5d6b-4c3c-8b01-d257254d5d14.png"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="handle1"
              name="handle"
              checked={state.selectedHandle === '603-02 Hardware 1'}
              onChange={() => setSelectedHandle('603-02 Hardware 1')}
            />
            <label htmlFor="handle1" className="flex-1">Hardware Style 1</label>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="handle2"
              name="handle"
              checked={state.selectedHandle === '603-02 Hardware 2'}
              onChange={() => setSelectedHandle('603-02 Hardware 2')}
            />
            <label htmlFor="handle2" className="flex-1">Hardware Style 2</label>
          </div>
        </div>
      </ConfigSection>
      
      {/* Arms Finish Section */}
      <ConfigSection
        title="2. Arms Finish"
        subtitle={`${state.selectedMaterial?.category.charAt(0) + state.selectedMaterial?.category.slice(1).toLowerCase()} ${state.selectedMaterial?.name}`}
        isOpen={sections.materials}
        onToggle={() => toggleSection('materials')}
        image={`/lovable-uploads/dedfb04e-5d6b-4c3c-8b01-d257254d5d14.png`}
      >
        {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => (
          <div key={category} className="mb-6">
            <h4 className="font-medium text-gray-500 mb-3">{category}</h4>
            <div className="grid grid-cols-5 gap-2">
              {categoryMaterials.map(material => (
                <ColorSwatch
                  key={material.id}
                  color={material.color}
                  name={material.name}
                  isActive={state.selectedMaterial?.id === material.id}
                  onClick={() => setSelectedMaterial(material)}
                />
              ))}
            </div>
          </div>
        ))}
      </ConfigSection>
      
      {/* Legs Selection Section */}
      <ConfigSection
        title="3. Legs Finish"
        subtitle="Steel"
        isOpen={sections.legs}
        onToggle={() => toggleSection('legs')}
        image="/lovable-uploads/dedfb04e-5d6b-4c3c-8b01-d257254d5d14.png"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="legA"
              name="leg"
              checked={state.selectedLeg === 'Leg A'}
              onChange={() => setSelectedLeg('Leg A')}
            />
            <label htmlFor="legA" className="flex-1">Standard Legs (4)</label>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="legB"
              name="leg"
              checked={state.selectedLeg === 'Leg B'}
              onChange={() => setSelectedLeg('Leg B')}
            />
            <label htmlFor="legB" className="flex-1">Premium Legs (2)</label>
          </div>
        </div>
      </ConfigSection>
      
      {/* Price and Cart Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Product Price</span>
          <div>
            <span className="text-2xl font-bold mr-2">${state.totalPrice}</span>
            <span className="text-gray-500 line-through">${state.totalPrice + 45}</span>
          </div>
        </div>
        
        <button className="w-full py-4 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorPanel;

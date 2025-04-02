
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// Define types
export type HandleType = '603-02 Hardware 1' | '603-02 Hardware 2';
export type LegType = 'Leg A' | 'Leg B';
export type MaterialCategory = 'LEATHER' | 'SILICON' | 'ALUMINIUM';
export type MaterialFinish = string;

export interface Material {
  id: string;
  name: string;
  color: string;
  category: MaterialCategory;
  price: number;
}

export interface ConfiguratorState {
  selectedHandle: HandleType;
  selectedLeg: LegType;
  selectedMaterial: Material | null;
  basePrice: number;
  totalPrice: number;
  backgroundSetting: 'light' | 'dark' | 'gradient';
  isFullscreen: boolean;
}

interface ConfiguratorContextType {
  state: ConfiguratorState;
  setSelectedHandle: (handle: HandleType) => void;
  setSelectedLeg: (leg: LegType) => void;
  setSelectedMaterial: (material: Material) => void;
  setBackgroundSetting: (setting: 'light' | 'dark' | 'gradient') => void;
  toggleFullscreen: () => void;
  materials: Material[];
}

// Create context
const ConfiguratorContext = createContext<ConfiguratorContextType | null>(null);

// Sample materials data
const initialMaterials: Material[] = [
  // LEATHER category
  { id: 'l1', name: 'Brown', color: '#5d4037', category: 'LEATHER', price: 50 },
  { id: 'l2', name: 'Forest', color: '#4b6043', category: 'LEATHER', price: 55 },
  { id: 'l3', name: 'Moss', color: '#637356', category: 'LEATHER', price: 55 },
  { id: 'l4', name: 'Sage', color: '#5a6750', category: 'LEATHER', price: 60 },
  { id: 'l5', name: 'Eggplant', color: '#4a2c40', category: 'LEATHER', price: 65 },
  { id: 'l6', name: 'Plum', color: '#7c4a72', category: 'LEATHER', price: 70 },
  { id: 'l7', name: 'Navy', color: '#2e4756', category: 'LEATHER', price: 60 },
  { id: 'l8', name: 'Rust', color: '#b53d34', category: 'LEATHER', price: 65 },
  { id: 'l9', name: 'Maroon', color: '#702a2a', category: 'LEATHER', price: 70 },
  { id: 'l10', name: 'Teal', color: '#056e63', category: 'LEATHER', price: 75 },
  
  // SILICON category
  { id: 's1', name: 'Brown', color: '#6d4c41', category: 'SILICON', price: 30 },
  { id: 's2', name: 'Forest', color: '#546e41', category: 'SILICON', price: 35 },
  { id: 's3', name: 'Moss', color: '#748456', category: 'SILICON', price: 35 },
  { id: 's4', name: 'Sage', color: '#6a7750', category: 'SILICON', price: 40 },
  { id: 's5', name: 'Eggplant', color: '#5a3c50', category: 'SILICON', price: 45 },
  
  // ALUMINIUM category - will be rendered as metallic in the 3D model
  { id: 'a1', name: 'Silver', color: '#CCCCCC', category: 'ALUMINIUM', price: 25 },
];

// Provider component
export const ConfiguratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConfiguratorState>({
    selectedHandle: '603-02 Hardware 1',
    selectedLeg: 'Leg A',
    selectedMaterial: initialMaterials[0], // Default to first material
    basePrice: 150,
    totalPrice: 200, // Base price + default material
    backgroundSetting: 'light',
    isFullscreen: false,
  });

  const setSelectedHandle = useCallback((handle: HandleType) => {
    setState(prev => ({
      ...prev,
      selectedHandle: handle,
      totalPrice: calculateTotalPrice(prev.basePrice, prev.selectedMaterial, handle, prev.selectedLeg),
    }));
  }, []);

  const setSelectedLeg = useCallback((leg: LegType) => {
    setState(prev => ({
      ...prev,
      selectedLeg: leg,
      totalPrice: calculateTotalPrice(prev.basePrice, prev.selectedMaterial, prev.selectedHandle, leg),
    }));
  }, []);

  const setSelectedMaterial = useCallback((material: Material) => {
    setState(prev => ({
      ...prev,
      selectedMaterial: material,
      totalPrice: calculateTotalPrice(prev.basePrice, material, prev.selectedHandle, prev.selectedLeg),
    }));
  }, []);

  const setBackgroundSetting = useCallback((setting: 'light' | 'dark' | 'gradient') => {
    setState(prev => ({ ...prev, backgroundSetting: setting }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  }, []);

  const calculateTotalPrice = (
    basePrice: number, 
    material: Material | null, 
    handle: HandleType, 
    leg: LegType
  ): number => {
    let total = basePrice;
    
    // Add material price
    if (material) {
      total += material.price;
    }
    
    // Handle specific pricing
    if (handle === '603-02 Hardware 2') {
      total += 15; // Premium handle costs more
    }
    
    // Leg specific pricing
    if (leg === 'Leg B') {
      total += 10; // Premium leg costs more
    }
    
    return total;
  };

  const contextValue = useMemo(() => ({
    state,
    setSelectedHandle,
    setSelectedLeg,
    setSelectedMaterial,
    setBackgroundSetting,
    toggleFullscreen,
    materials: initialMaterials,
  }), [
    state, 
    setSelectedHandle, 
    setSelectedLeg,
    setSelectedMaterial,
    setBackgroundSetting,
    toggleFullscreen
  ]);

  return (
    <ConfiguratorContext.Provider value={contextValue}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

// Custom hook for using the context
export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error('useConfigurator must be used within a ConfiguratorProvider');
  }
  return context;
};

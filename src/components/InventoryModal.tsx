'use client';

import React, { useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { InventoryResponse } from '@/types';
import Spinner from './Spinner';
import Image from 'next/image';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryResponse | undefined;
  isLoading: boolean;
  error: any;
}

// Available SVG files (excluding non-food items)
const availableItems = [
  'apple', 'banana', 'bread', 'eggs', 'grapes', 
  'lime', 'milk', 'potato', 'sodacan', 'yogurt', 'orange'
];

// Helper function to get the appropriate SVG for an item
const getItemSvg = (itemName: string): string => {
  // Normalize: lowercase and remove all whitespace
  const normalizedName = itemName.toLowerCase().replace(/\s+/g, '');
  if (availableItems.includes(normalizedName)) {
    return `/${normalizedName}.svg`;
  }
  return '/potato.svg'; // Default fallback
};

export default function InventoryModal({ 
  isOpen, 
  onClose, 
  inventory, 
  isLoading, 
  error 
}: InventoryModalProps) {

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items with quantity > 0
  const displayItems = inventory?.data?.inventory.filter(item => item.quantity > 0) || [];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              Failed to load inventory. Please try again.
            </div>
          ) : displayItems.length > 0 ? (
            <div className="space-y-6">
              {/* Shelve with items */}
              <div className="relative w-full">
                {/* Shelve background */}
                <div className="relative w-full h-48">
                  <Image 
                    src="/shelve.svg" 
                    alt="Shelve"
                    fill
                    className="object-contain"
                    priority
                  />
                  
                  {/* Items on shelve */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 px-8 pb-8">
                    {displayItems.map((item, index) => (
                      <div 
                        key={`${item.name}-${index}`}
                        className="flex flex-col items-center group"
                      >
                        {/* Item image */}
                        <div className="relative w-16 h-16 mb-2 transition-transform group-hover:scale-110">
                          <Image 
                            src={getItemSvg(item.name)}
                            alt={item.name}
                            fill
                            className="object-contain drop-shadow-lg"
                          />
                        </div>
                        
                        {/* Quantity badge */}
                        <div className="bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                          {item.quantity}
                        </div>
                        
                        {/* Item name tooltip */}
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-gray-700 capitalize bg-white px-2 py-1 rounded shadow-sm">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                <p>Last updated: {new Date(inventory!.data.timestamp).toLocaleString()}</p>
                {inventory!.cached && (
                  <p className="text-xs text-gray-400 mt-1">(Cached)</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-8">
              <p className="text-lg">Your inventory is empty</p>
              <p className="text-sm mt-2">Add items to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

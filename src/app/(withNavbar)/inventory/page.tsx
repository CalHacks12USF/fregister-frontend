'use client';

import React from 'react';
import Image from 'next/image';
import Spinner from '@/components/Spinner';
import { useInventory } from '@/hooks/useInventory';

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

export default function InventoryPage() {
  const { inventory, isLoading, error } = useInventory();

  // Filter items with quantity > 0
  const displayItems = inventory?.data?.inventory.filter(item => item.quantity > 0) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Inventory</h1>
        <p className="text-gray-600 mt-2">View your current food inventory</p>
      </div>

      {/* Content - grows to fill space */}
      <div className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">
            Failed to load inventory. Please try again.
          </div>
        ) : displayItems.length > 0 ? (
          <>
            {/* Shelve with items - centered */}
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
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-8 pb-14">
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
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg">Your inventory is empty</p>
            <p className="text-sm mt-2">Add items to get started!</p>
          </div>
        )}
      </div>

      {/* Footer info - pinned to bottom */}
      {!isLoading && !error && displayItems.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200 mt-8">
          <p>Last updated: {new Date(inventory!.data.timestamp).toLocaleString()}</p>
          {inventory!.cached && (
            <p className="text-xs text-gray-400 mt-1">(Cached)</p>
          )}
        </div>
      )}
    </div>
  );
}

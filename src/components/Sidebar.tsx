'use client';

import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';

const dummyChats = [
  { id: 1, title: "Generate a shopping list for mis..." },
  { id: 2, title: "Plan a week's worth of meals" },
  { id: 3, title: "Optimize my weekly meal plan w..."},
  { id: 4, title: "Create a recipe based on availa..." },
  { id: 5, title: "Find recipes for a specific cuisine" }
];


export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      // Opening sidebar - show skeleton
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <aside className={`
      ${isCollapsed ? 'w-12' : 'w-64'}
      bg-primary
      shadow-xl
      min-h-screen
      px-2
      flex
      flex-col
      transition-all
      duration-300
    `}>
      <div className="p-2 mb-3 flex justify-between items-center min-h-10">
        {!isCollapsed && <h2 className="font-bold text-secondary">Fregister</h2>}
        <ViewSidebarRoundedIcon
          fontSize="small"
          onClick={handleToggle}
          className="hover:cursor-pointer"
        />
      </div>
      <div className="flex font-normal text-sm items-center hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2">
        <div className="w-6 flex justify-center shrink-0">
          <AddIcon fontSize="small" />
        </div>
        <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 ml-2'}`}>
          New Chat
        </span>
      </div>
      <div className="flex font-normal text-sm items-center hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2">
        <div className="w-6 flex justify-center shrink-0">
          <SearchIcon fontSize="small" />
        </div>
        <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 ml-2'}`}>
          Search chats
        </span>
      </div>
      <div className="flex font-normal text-sm items-center hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2">
        <div className="w-6 flex justify-center shrink-0">
          <KitchenIcon fontSize="small" />
        </div>
        <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden ml-0' : 'opacity-100 ml-2'}`}>
          Inventory
        </span>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto mt-6 px-2">
          <h3 className="text-sm font-semibold text-custom-gray animate-fade-in">Recent Chats</h3>
          <hr className='text-secondary opacity-70 my-2 animate-fade-in'/>
          {/* Chat history items will go here */}
          {isLoading ? (
            // Skeleton loading
            <>
              {[1, 2, 3, 4, 5].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-8 bg-secondary/20 rounded-md mb-2 animate-pulse"
                />
              ))}
            </>
          ) : (
            // Actual chat items
            dummyChats.map((chat, index) => (
              <div
                key={chat.id}
                className="text-sm hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2 opacity-0 animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
              >
                {chat.title}
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
}

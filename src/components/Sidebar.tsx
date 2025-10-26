'use client';

import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useInventory } from '@/hooks';
import { useThreads } from '@/hooks/useThreads';
import { useAuth } from '@/contexts/AuthContext';
import InventoryModal from './InventoryModal';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';


export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  // Fetch inventory data
  const { inventory, error: inventoryError, isLoading: isInventoryLoading } = useInventory();

  // Fetch threads data
  const { threads, isLoading: isThreadsLoading, error: threadsError } = useThreads({ limit: 20 });

  // Get user data and logout function
  const { user, logout } = useAuth();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary text-secondary rounded-md shadow-lg hover:bg-primary/90 transition-colors"
      >
        <MenuOpenRoundedIcon fontSize="small" />
      </button>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: Always visible, Mobile: Slide-in overlay */}
      <aside className={`
        ${isCollapsed ? 'md:w-12' : 'md:w-64'}
        bg-primary
        shadow-xl
        h-screen
        px-2
        flex
        flex-col
        transition-all
        duration-300

        // Mobile styles
        fixed md:relative
        z-50
        w-4/5
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      <div className="p-2 mb-3 flex justify-between items-center min-h-10">
        <h2 className={`font-bold text-secondary text-3xl md:text-base ${isCollapsed ? 'md:hidden' : ''}`}>Fregister</h2>
        <ViewSidebarRoundedIcon
          fontSize="small"
          onClick={handleToggle}
          className="hover:cursor-pointer !hidden md:!block"
        />
      </div>
      <Link
        href="/"
        className="flex font-normal text-base md:text-sm items-center hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="w-6 flex justify-center shrink-0">
          <AddIcon sx={{ fontSize: 40 }} className="md:!text-xl" />
        </div>
        <span className={`transition-all duration-300 whitespace-nowrap ml-2 md:ml-0 text-3xl md:text-base ${isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'md:opacity-100 md:ml-2'}`}>
          New Chat
        </span>
      </Link>
      <div
        className="flex font-normal text-base md:text-sm items-center hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2"
        onClick={() => setIsInventoryModalOpen(true)}
      >
        <div className="w-6 flex justify-center shrink-0">
          <KitchenIcon fontSize="small" />
        </div>
        <span className={`transition-all duration-300 whitespace-nowrap ml-2 md:ml-0 ${isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'md:opacity-100 md:ml-2'}`}>
          Inventory
        </span>
      </div>

      <div className={`flex-col flex-1 min-h-0 mt-6 px-2 flex md:flex ${isCollapsed ? 'md:hidden' : ''}`}>
        <h3 className="text-base md:text-sm font-semibold text-custom-gray animate-fade-in">Recent Chats</h3>
        <hr className='text-secondary opacity-70 my-2 animate-fade-in'/>
          <div className="flex-1 overflow-y-auto min-h-0">
            {isThreadsLoading ? (
              // Skeleton loading
              <>
                {[1, 2, 3, 4, 5].map((skeleton) => (
                  <div
                    key={skeleton}
                    className="h-8 bg-secondary/20 rounded-md mb-2 animate-pulse"
                  />
                ))}
              </>
            ) : threadsError ? (
              <div className="text-base md:text-sm text-red-500 px-1 py-2">
                Failed to load chats
              </div>
            ) : !threads || threads.length === 0 ? (
              <div className="text-base md:text-sm text-custom-gray px-1 py-2">
                No chats yet
              </div>
            ) : (
              // Actual thread items
              threads.map((thread, index) => (
                <Link
                  href={`/chat/${thread.id}`}
                  key={thread.id}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className="text-base md:text-sm hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    {thread.title}
                  </div>
                </Link>
              ))
            )}
          </div>
      </div>

      {/* Profile Section */}
      {user && (
        <div className='border-t border-secondary/30 -mx-2 pt-2'>
          <div
            className="mt-auto mb-2 flex items-center hover:cursor-pointer hover:bg-secondary/15 rounded-md px-1 py-2 mx-2"
            onClick={handleProfileClick}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 24, height: 24 }}
              className="shrink-0"
              imgProps={{
                referrerPolicy: "no-referrer"
              }}
            />
            <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis text-base md:text-sm ml-2 md:ml-0 ${isCollapsed ? 'md:opacity-0 md:w-0' : 'md:opacity-100 md:ml-2'}`}>
              {user.name}
            </span>
          </div>
        </div>
      )}

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#00543c',
            color: '#ededed',
            borderRadius: '0.375rem',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            minWidth: '180px',
            marginTop: '-8px',
            border: '1px solid rgba(253, 187, 48, 0.2)',
          },
        }}
      >
        <MenuItem
          onClick={handleProfileMenuClose}
          component={Link}
          href="/profile"
          sx={{
            fontSize: '0.875rem',
            padding: '8px 16px',
            gap: '12px',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(253, 187, 48, 0.15)',
            },
          }}
        >
          <PersonIcon fontSize="small" />
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            fontSize: '0.875rem',
            padding: '8px 16px',
            gap: '12px',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(253, 187, 48, 0.15)',
            },
          }}
        >
          <LogoutIcon fontSize="small" />
          Logout
        </MenuItem>
      </Menu>

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        inventory={inventory}
        isLoading={isInventoryLoading}
        error={inventoryError}
      />
    </aside>
    </>
  );
}

import { useRef, useState } from 'react';
import { Popover } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/20/solid';
import ChatBot from './ChatBot';

export default function Searchbar({ setSearch }) {
  const searchRef = useRef();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = () => {
    setSearch(searchRef.current.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <>
      {/* 🌌 Elegant Navbar */}
      <Popover
        as="header"
        className={({ open }) =>
          `bg-black text-white sticky top-0 z-50 transition-all duration-300 shadow-lg ${
            open ? 'overflow-y-auto' : ''
          }`
        }
      >
        {({ open }) => (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              {/* ✨ Brand */}
              {/* ✨ Brand with Logo */}
<div className="hidden md:flex items-center">
  <img
    className="h-20 w-auto rounded-md drop-shadow-md"
    src="../../public/note mate logo.png"
    alt="NoteMate"
  />
</div>
              {/* 🔍 Search Bar */}
              <div className="flex-1 mx-6 max-w-2xl">
                <div className="relative group">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search your notes..."
                    className="w-full rounded-xl bg-white/90 text-gray-800 py-2 pl-4 pr-10 text-sm shadow-xl ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder:text-gray-500 backdrop-blur"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <div
                    onClick={handleSearch}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer group-hover:scale-110 transition-transform"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 hover:text-gray-500 transition duration-200" />
                  </div>
                </div>
              </div>

              {/* 🚪 Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-gray-700 to-gray-900 hover:from-grey-600 hover:to-grey-500 text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </Popover>

     <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="rounded-xl shadow-xl border border-gray-300 overflow-hidden bg-white">
    <ChatBot />
  </div>
</div>

    </>
  );
}

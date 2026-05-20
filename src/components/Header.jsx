import React from "react";
import { BellIcon, User, ChevronDown, Menu, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";


const Header = ({ toggleSidebar, isSidebarOpen}) => {

  return (
    <div className="w-full dark:bg-black fixed bg-white flex border-b border-gray-200 z-30">
      <nav className="ml-4 dark:bg-amber-600  flex flex-row justify-between w-[81%] p-2.5 items-center">
        
        {/* Left: toggle + title */}
        <div className="flex items-center dark:text-amber-600 space-x-3">
          {/* Sidebar toggle icon */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? (
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <div className="flex flex-col">
            <h3 className="text-lg dark:text-green-500">Admin</h3>
            <p className="text-sm text-gray-900">Welcome to the Dashboard <span >🎊</span></p>
          </div>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex dark:bg-black items-center space-x-8">
          <button>
            <BellIcon className="w-4 h-4" />
          </button>


          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
              <Link to="/admin-profile" className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">Admin12... </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
           
              </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;

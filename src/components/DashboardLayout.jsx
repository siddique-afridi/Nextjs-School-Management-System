import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";



const DashboardLayout = ({ children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen dark:bg-black flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {isSidebarOpen && <Sidebar />}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Pass toggle function and sidebar state */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
     
        <main className="mt-11 pt-5 dark:bg-black">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

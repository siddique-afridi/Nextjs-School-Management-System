import { useAuth } from './AuthContext';
import logo from '../assets/logo.png'
import { NavLink } from 'react-router-dom';
import { LayoutDashboard,GraduationCap, Users, BookOpen, LogOut, Award } from 'lucide-react';
import { useNavigate } from "react-router-dom";


function Sidebar(){
    const { logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();          // clear auth state and localStorage
      navigate("/login"); // redirect to login page
    };

return (
  <>
    {/* // <div className="flex gap-2.5  flex-row min-h-screen bg-gray-200 border border-amber-300"> */}
      {/* Sidebar */}
      <div className="w-64 pl-2 dark:bg-gray-400 text-gray-900 fixed top-0 left-0 h-full  overflow-y-autow-64 bg-white border-r border-gray-200 min-h-screen">
        <div className=' border-b border-gray-200 h-17 dark:bg-gray-500  flex items-center '>

        <img
    src={logo}
    alt="School Logo"
    className="w-10 h-10 object-contain rounded-full ml-3" // controls width/height
  />
        </div>

        <div className=' flex flex-col justify-between h-[85%] mt-2.5'>
        <ul className="space-y-2">
  <li>
  <NavLink
  to="/dashboard"
  className={({ isActive }) =>
    `flex items-center gap-3 w-full rounded-2xl px-5 py-2 transition ${
      isActive ? " text-blue-500" : "hover:bg-blue-100"
    }`
  }
>
  {({ isActive }) => (
    <>
      <LayoutDashboard
        className={`w-5 h-5 ${isActive ? "fill-current text-blue-500" : "text-gray-600"}`}
      />
      <span>Dashboard</span>
    </>
  )}
</NavLink>

  </li>
  <li>
  <NavLink
  to="/students"
  className={({ isActive }) =>
    `flex items-center gap-3 w-full rounded-2xl px-5 py-2 transition ${
      isActive ? " text-blue-500" : "hover:bg-blue-100"
    }`
  }
>
  {({ isActive }) => (
    <>
      <Users
        className={`w-5 h-5 ${isActive ? "fill-current text-blue-500" : "text-gray-600"}`}
      />
      <span>Students</span>
    </>
  )}
</NavLink>

  </li>
  <ul>
  <li>
    <NavLink
      to="/teachers"
      className={({ isActive }) =>
        `flex items-center gap-3 w-full rounded-2xl px-5 py-2 transition ${
          isActive ? " text-blue-500" : "hover:bg-blue-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <GraduationCap
            className={`w-5 h-5 ${isActive ? "fill-current text-blue-500" : "text-gray-600"}`}
          />
          <span>Teachers</span>
        </>
      )}
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/courses"
      className={({ isActive }) =>
        `flex items-center gap-3 w-full rounded-2xl px-5 py-2 transition ${
          isActive ? " text-blue-500" : "hover:bg-blue-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <BookOpen
            className={`w-5 h-5 ${isActive ? "fill-current text-blue-500" : "text-gray-600"}`}
          />
          <span>Courses</span>
        </>
      )}
    </NavLink>
    <NavLink
      to="/results"
      className={({ isActive }) =>
        `flex items-center gap-3 w-full rounded-2xl px-5 py-2 transition ${
          isActive ? " text-blue-500" : "hover:bg-blue-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Award
            className={`w-5 h-5 ${isActive ? "fill-current text-blue-500" : "text-gray-600"}`}
          />
          <span>Result</span>
        </>
      )}
    </NavLink>
  </li>
</ul>

</ul>

<button
  onClick={handleLogout}
  className="ml-4 w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer transition-transform duration-300 hover:scale-105"
>
  <LogOut size={20} />
</button>

        </div>
      </div>
     {/* </div> */}
     </>
)
}

export default Sidebar
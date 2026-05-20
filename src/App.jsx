import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardLayout from "./components/DashboardLayout";
import Teachers from "./components/Teachers";
import Students from "./components/Students";
import Courses from "./components/Courses";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProfile from "./components/AdminProfile";
import Register from "./components/Register";
import LoginSuccess from "./pages/LoginSuccess";
import Result from "./components/Result/Result";


function App() {
 //                        //Use themeContext for darkMode toggle instead of this method,using props drilling. its messy.

  return (
  

    <div className="App">
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login-success" element={<LoginSuccess />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
               <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
          />

        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <DashboardLayout >
                <Teachers />
              </DashboardLayout>
             </ProtectedRoute>
          }
          />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
             <DashboardLayout>
                <Courses />
              </DashboardLayout>
             </ProtectedRoute>
          }
          />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
             <DashboardLayout>
                <Students />
              </DashboardLayout>
             </ProtectedRoute>
          }
          />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
             <DashboardLayout>
                <Result/>
              </DashboardLayout>
             </ProtectedRoute>
          }
          />

        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminProfile />
              </DashboardLayout>
             </ProtectedRoute>
          }
          />

        <Route path="/" element={<Login />} />
      </Routes>

      {/* Toast container (keep at bottom of App) */}
      <ToastContainer position="top-center" autoClose={1000} />
        
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import ErrorHandler from "./ErrorHandler";
// import { getStudents } from "../api/studentApi";
// import { getTeachers } from "../api/teacherApi";
// import { getClassStats } from "../api/statsApi";
import { getDashboardData } from "../api/dashboardApi";

function Dashboard() {
  // const [chartData,setChartData] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classStats, setClassStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // one API call
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setTeachers(data.teachers || []);
        setStudents(data.students || []);
        setCourses(data.courses || []);
        setClassStats(data.stats || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Our server is currently down. please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isLoggedIn, navigate]);
  if (error) return <ErrorHandler error={error} />;

  if (!isLoggedIn) return null;
  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="flex-1 p-8 bg-white dark:bg-black shadow-sm ">
      {/* Stats Cards */}

      <div className="grid dark:bg-amber-800 grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-[linear-gradient(84deg,rgba(255,255,255,0)_-8.3%,#F6F8FA_100%)] rounded-lg shadow text-center">
          <h2 className="text-xl dark:text-amber-400 font-bold text-gray-800">
            Students
          </h2>
          <p className="text-3xl font-semibold text-blue-700">
            {students.length}
          </p>
        </div>
        <div className="p-6 bg-[linear-gradient(84deg,rgba(255,255,255,0)_-8.3%,#F6F8FA_100%)] rounded-lg shadow text-center">
          <h2 className="text-xl font-bold text-gray-800">Teachers</h2>
          <p className="text-3xl font-semibold text-green-700">
            {teachers.length}
          </p>
        </div>
        <div className="p-6 bg-[linear-gradient(84deg,rgba(255,255,255,0)_-8.3%,#F6F8FA_100%)] rounded-lg shadow text-center">
          <h2 className="text-xl font-bold text-gray-800">Courses</h2>
          <p className="text-3xl font-semibold text-yellow-700">
            {courses.length}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={classStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="class" fill="#8884d8" />
          <YAxis />
          <Tooltip
          // formatter={(value, name, props) => {
          //   if (name === "teacherCount") {
          //     // show teacher names in tooltip
          //     const teachers = props.payload.teacherAssigned || [];
          //     return [`${value} (${teachers.join(", ")})`, "Teachers"];
          //   }
          //   return [value, name];
          // }}
          />
          <Bar dataKey="totalStudents" fill="#1194d8" />
          <Bar dataKey="teacherCount" fill="#8884d8" name="Teachers">
            <LabelList
              dataKey="teacherAssigned" // array of names
              position="top"
              formatter={(names) => names.join(", ")} // turn array → string
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* recent activity card */}

      {/* Recent Students */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Students
          </h2>
          <button
            onClick={() => navigate("/students")}
            className="text-blue-600 hover:underline hover:cursor-pointer"
          >
            View All
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {students.slice(-5).map((s) => (
            <li key={s._id} className="py-2">
              <span className="font-medium">{s.name}</span> – Class {s.class}
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Teachers */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Teachers
          </h2>
          <button
            onClick={() => navigate("/teachers")}
            className="text-blue-600 hover:underline hover:cursor-pointer"
          >
            View All
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {teachers.slice(-5).map((t) => (
            <li key={t._id} className="py-2">
              <span className="font-medium">{t.name}</span> – {t.subject}
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Courses */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Courses
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="text-blue-600 hover:underline hover:cursor-pointer"
          >
            View All
          </button>
        </div>
        {/* <ul className="divide-y divide-gray-200">
          {courses.slice(-5).map((c) => (
            <li key={c.id} className="py-2">
              <span className="font-medium">{c.name || c.title}</span> – {c.teacher || c.code}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default Dashboard;

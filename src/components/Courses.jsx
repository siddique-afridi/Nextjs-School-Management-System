import React, { useState, useEffect } from "react";
// import { courses as initialCourses } from "../data/DummyData";
import Table from "./Table";
import { toast } from "react-toastify";
import { createCourse, deleteCourseById, getAllCourses } from "../api/coursesApi";
import { getTeachers } from "../api/teacherApi";
import ErrorHandler from "./ErrorHandler";


function Courses() {
  const token = localStorage.getItem("token")
  const [isOpen, setIsOpen] = useState(false);
  const [teachers, setTeachers] = useState([])
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  
  const [newCourse, setNewCourse] = useState({ name: "", teacher: "" });
  // 🔎 Search state  1 (START FILTERING)
  const [search, setSearch] = useState("");
  
  //  getting teachers for dropdown select
  const fetchTeachers=async()=>{
    try{
    
      const data = await getTeachers(token);
      setTeachers(data)
    }catch(err){
      console.log("error fetching teachers",err)
      setError("Our server is currently down. please try again later.")
    }
  }

  const fetchCourses = async()=>{

    try{
      const res = await getAllCourses(token);
      setCourses(res)
    }catch(err){
      console.error("error fetching courses")
    }
  }

  useEffect(()=>{
    fetchCourses();
    fetchTeachers();
  },[])
if(error) return <ErrorHandler error={error} />

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async(e) => {
    e.preventDefault();
    if (newCourse.name && newCourse.teacher) {
      try{
        const courseData = {
          name: newCourse.name,
          code: newCourse.code,
          teacherId: newCourse.teacher,
          creditHours: newCourse.creditHours,
          duration: newCourse.duration
        }


        const savedCourses = await createCourse(courseData, token);
        setCourses([...courses , savedCourses]);
        fetchCourses();
    
        setNewCourse({ name: "", teacher: "" });
        setIsOpen(false);
         // ✅ Show success toast
      toast.success("Course added successfully!");

      }catch(err){
           console.error("error creating course")
      }

    }
  };

  const handleDelete = async(id) => {
     try{
      if(!token) return alert("you are not logged in");

      await deleteCourseById(token,id);

      const updated = courses.filter((c)=> c._id !== id);
      setCourses(updated)

      toast.success("Course deleted successfully")

     }catch(err){
      console.error("error deleting course", err.message)
     }
  };

  const columns = [
    { key: "code", label: "Course Code" },
    { key: "name", label: "Course Name" },
    { key: "teacher", label: "Teacher" },
    {key:"creditHours", label:"Credit Hours"},
    {key:"duration", label:"Duration (hrs)"},
  ];

  // 🔎 Filter courses based on search   2
  // const filteredCourses = courses.filter((course) =>
  //   course.name.toLowerCase().includes(search.toLowerCase())
  // );
  // THIS IS FOR TYPING THE EXACT FULL NAME OF COURSE AFTER WHICH COURSE WILL BE SHOWN

  // const filteredCourses = courses.filter((course) =>
  //   course.name.toLowerCase() === search.toLowerCase()
  // );
  
  return (
    <div className="flex">
      <div className="flex-1 p-8 bg-white  shadow-sm">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Courses</h1>

          <input
            type="text"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Course
          </button>
        </div>

        {/* Table or "not found" message   3 (END)FILTERING */}
        {search.trim() === "" ? (
          // Show all courses when search is empty
          <Table data={courses} columns={columns} onDelete={handleDelete} />
        ) : filteredCourses.length > 0 ? (
          // Show filtered table when search has text
          <Table
            data={filteredCourses}
            columns={columns}
            onDelete={handleDelete}
          />
        ) : (
          // Show message if no match
          <p className="text-gray-500 text-center">
            No courses found matching "{search}"
          </p>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Course</h2>

            <form className="space-y-4" onSubmit={handleAdd}>
              <input
                type="text"
                name="code"
                placeholder="Enter course code"
                value={newCourse.code}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Enter course name"
                value={newCourse.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <div className="flex gap-2">

              <input
                type="number"
                name="creditHours"
                placeholder="Enter credithours"
                value={newCourse.creditHours}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Course duration"
                value={newCourse.duration}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              </div>

           
             <select 
             name="teacher"
             value={newCourse.teacher}
             onChange={handleChange}
             className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
             required>
              <option value="">Select Teacher</option>
              {teachers.map((t)=>(
                <option key={t._id} value={t._id}>
                  {t.name} ({t.subject})
                </option>

              ))}
             </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={()=>console.log("clicked")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;

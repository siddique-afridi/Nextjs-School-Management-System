import React, { useEffect, useState } from "react";
// import { teachers as initialTeachers } from '../data/DummyData';
import Table from "./Table";
import { toast } from "react-toastify";
import { createTeacher, deleteTeacher, getTeachers } from "../api/teacherApi";
import { getAllCourses } from "../api/coursesApi";
import Chatbot from "./Chatbot/Chatbot";
import ErrorHandler from "./ErrorHandler";

function Teachers() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  // const [courses, setCourses] = useState([]);   we are assigning courses in add course section dynamically to teachers
  const [isOpen, setIsOpen] = useState(false);
  const [teachers, setTeachers] = useState([]); // step 1 state to load and save created teachers from backend
  const [newTeacher, setNewTeacher] = useState({ name: "", subject: "" }); // step 2 state to input details that we want to send to backend to store
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  // console.log("token", token)

  // const filteredTeachers = teachers.filter((teacher)=>
  //  teacher.name.toLowerCase().includes(search.toLowerCase()));

  // const fetchCourses = async () => {
  //   try {
  //     const res = await getAllCourses(token);        > courses are assigned from course section
  //     setCourses(res);
  //   } catch (err) {
  //     console.error("error fetching courses");
  //   }
  // };

  const fetchTeachers = async () => {
    try{
      const data = await getTeachers(token);
  
      setTeachers(data);
      
    }catch(err){
      setError("Our server is currently down. please try again later.")  
      console.error("Error fetching teachers", err);
    }
  };
  
  useEffect(() => {
    fetchTeachers();
    // fetchCourses();         ^^
  }, []);
  if(error) return <ErrorHandler error={error} />

  const handleChange = (e) => {
    const { name, value } = e.target; // step 3 targeted name and value of input
    setNewTeacher((prev) => ({ ...prev, [name]: value })); // we are spreading newTeacher to include other keys and values from the inputs if we want to add in future and saving its state
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (newTeacher.name) {
      // just making it necessary to have name and subject in order to send data
      try {
        const teacherData = {
          //step 4 preparing data that we want to send to backend inside createTeacher().
          name: newTeacher.name,
          email: newTeacher.email,
          password: newTeacher.password,
          subject: newTeacher.subject, // courses: newTeacher.courses,
          contact: newTeacher.contact,
          gender: newTeacher.gender,
          age: newTeacher.age,
          class: newTeacher.class,
        }; // step 5 calling the api to create teacher
        // now lets call api and send the data to backend
        const savedTeacher = await createTeacher(teacherData, token);
        //we called createTeacher() but what data to send>>> so write teacherData inside>>> ()
        setTeachers([...teachers, savedTeacher]);

        //it resets the form to empty values
        setNewTeacher({
          name: "",
          email: "",
          password: "",
          subject: newTeacher.subject,
          //  courses: '',
          contact: "",
          gender: "",
          age: "",
          class: "",
        });

        setIsOpen(false);

        // ✅ Show success toast
        toast.success("Teacher added successfully!");
      } catch (error) {
        toast.error("Failed to delete teacher");
        console.error("Error creating teacher", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteTeacher(id, token);
      const updated = teachers.filter((t) => t._id != id);

      setTeachers(updated);
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teacher");
    }
  };

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "courses", label: "Course" },
    { key: "contact", label: "Contact" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
  ];

  return (
    <div className="flex">
      <div className="flex-1 p-8 bg-white shadow-sm">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Teachers</h1>

          <input
            type="text"
            value={search}
            placeholder="Search teacher..."
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Teacher
          </button>
        </div>

        {/* Table */}

        <Table
          data={teachers}
          columns={columns}
          onDelete={handleDelete}
          onView={handleView}
        />

        <Chatbot/>
        {/* {search.trim()==="" ? (

          <Table data={teachers} columns={columns} onDelete={handleDelete} onView={handleView}/>
        ) : filteredTeachers.length>0 ? (
          <Table data={filteredTeachers} columns={columns} onDelete={handleDelete} onView={handleView}/>
          ) : (
            <p className='text-center text-gray-500'>No teacher found matching "{search}"</p>
          )

        } */}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Add Teacher
            </h2>

            <form className="space-y-4" onSubmit={handleAdd}>
              <input
                type="text"
                name="name"
                placeholder="Enter teacher name"
                value={newTeacher.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={newTeacher.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={newTeacher.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />

              <div className="flex gap-2.5">
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject name"
                  value={newTeacher.subject}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />

                {/* <select
                  name="courses"
                  value={newTeacher.courses}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} 
                    </option>
                  ))}   
                </select> */}

                <input
                  type="text"
                  name="class"
                  placeholder="Enter class"
                  value={newTeacher.class}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <input
                type="text"
                name="age"
                placeholder="Enter your age"
                value={newTeacher.age}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                name="gender"
                placeholder="Gender..."
                value={newTeacher.gender}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Enter contact details"
                value={newTeacher.contact}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

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
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative border border-blue-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Teacher Details
              </h2>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-2 py-1 hover:bg-red-500 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Body: Grid layout for details */}
            <div className="grid grid-cols-1 gap-4 text-gray-700 max-h-96 overflow-y-auto">
              <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                <span className="font-medium">Name:</span>
                <span className="text-gray-800">{selectedTeacher.name}</span>
              </div>

              <div className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                <span className="font-medium">Subject:</span>
                <span className="text-gray-800">{selectedTeacher.subject}</span>
              </div>

              {selectedTeacher.details &&
                Object.entries(selectedTeacher.details).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="capitalize font-medium">{key}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
            </div>

            {/* Footer */}
            {/* <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedTeacher(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;

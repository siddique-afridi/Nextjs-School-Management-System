import React, { useState, useEffect } from "react";
import Table from "./Table";
import { createStudent, getStudents, deleteStudent } from "../api/studentApi";
import { toast } from "react-toastify";
import ClassSelect from "../component/ui/ClassSelect";
import { CSVLink } from "react-csv";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { getTeachers } from "../api/teacherApi";
import { getAllCourses } from "../api/coursesApi";
import StudentMap from "./Map/StudentMap";
import ErrorHandler from "./ErrorHandler";

const cities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Faisalabad",
  "Rawalpindi",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
];

function Students() {
  const [teachers, setTeachers] = useState([]); //for storing teachers
  const [courses, setCourses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); // class filter

  const [isOpen, setIsOpen] = useState(false);
  // const [city, setCity] = useState("Lahore");
  // const [nearBystudents, setnearByStudents] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("")
  const [students, setStudents] = useState([]); //empty array in state to store students state loaded from backend through fetchData().
  
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    age: "",
    teacher: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null); //  for details modal
  // filtering
  const [search, setSearch] = useState("");
  // use state for selecting gender
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  
  //  const cities = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan","Peshawar", "Quetta", "Hyderabad", "Sialkot"];
  
  // nearby students by city
  // const handleSearch = async () => {
    //   setLoading(true);
    //   const res = await fetch(`http://localhost:5000/api/students/nearbyCity?city=${city}&distance=50000`);
    //   const data = await res.json();
    //   setnearByStudents(data.students || []);
    //   setMessage(data.message)
    //   setLoading(false);
    // };
    
    
    //fetch students when page loads//////////////
    // Fetch students (with filters if applied)
    const fetchData = async () => {
      try {
        const filters = {};
        if (search) filters.search = search; // add search if typed
        if (selectedClass) filters.class = selectedClass; // add class if chosen
        
        const data = await getStudents(filters);
        setStudents(data);
      } catch (err) {
        setError("Our server is currently down. please try again later.")
        console.error("Error fetching students", err);
      }
    };
    
    useEffect(() => {
      fetchData();
      // the empty array below means as long as we are on students component data will not be fetched again from backend
    }, [search, selectedClass]);
    // //////////////////////////
    
    useEffect(() => {
      if (selectedStudent) {
        document.body.style.overflow = "hidden"; // lock scroll
      } else {
        document.body.style.overflow = "auto"; // restore scroll
      }
      
      return () => {
        document.body.style.overflow = "auto"; // cleanup
      };
    }, [selectedStudent]);
    
    // fetch courses for enrolling students
    const fetchCourses = async () => {
      const data = await getAllCourses(token);
      
      setCourses(data);
    };
    
    // fetch teachers to store them in state to display them on ui in select
    useEffect(() => {
      const fetchTeachers = async () => {
        if (!token) {
          console.log("no token in localstorage");
        }
        const data = await getTeachers(token);
        
        setTeachers(data);
        console.log("i am teachers array", data);
      };
      fetchCourses();
      fetchTeachers();
    }, []);
    
    if(error) return <ErrorHandler error={error} />
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newStudent.name && newStudent.class) {
      try {
        const studentData = {
          name: newStudent.name,
          email: newStudent.email,
          password: newStudent.password,
          class: newStudent.class,
          age: newStudent.age,
          gender: gender,
          contact: newStudent.contact,
          courses: newStudent.courses,
          city: newStudent.city,
          // teacher: newStudent.teacher,
        };
        // Call backend to save in DB
        const token = localStorage.getItem("token");
        const savedStudent = await createStudent(studentData, token);
        console.log("Selected student:", selectedStudent);
        // update with new student
        setStudents([...students, savedStudent]);
        fetchData();
        // Reset form
        setNewStudent({
          name: "",
          email: "",
          password: "",
          class: "",
          age: "",
          city: "",
          profession: "",
          contact: "",
          courses: "",
          // teacher: ""
        });
        setIsOpen(false);
        console.log("checking...");
        setGender("");
        toast.success(
          `Student added successfully! Now upload profile for ${savedStudent.name}`
        );
      } catch (error) {
        console.error("Error creating student:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ✅ get token
      console.log("delete id", id);

      if (!token) {
        alert("You are not logged in!");
        return;
      }
      await deleteStudent(id, token);

      const updated = students.filter((s) => s._id !== id);
      setStudents(updated);
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student", error);
      toast.error("Failed to delete student");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "rollNo", label: "Roll No" },
    { key: "class", label: "Class" },
    { key: "teacher", label: "Teacher" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "contact", label: "Contact" },
  ];

  // const filteredStudents = students.filter((student) =>
  //   (student.name || "").toLowerCase().includes(search.toLowerCase())
  // );

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  // creating labels for radio buttons
  const options = ["male", "female", "other"];

  // CSV headers
  const headers = [
    { label: "Name", key: "name" },
    { label: "Roll No", key: "rollNo" }, // optional if not used
    { label: "Class", key: "class" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Contact", key: "contact" },
  ];


  // CSV download option for downloading record
  // 1 install and import dependencies
  // 2 paste the header like above according to columns
  // 3 paste download button inside return above table

  return (
    <div className="flex ">
      <div className="flex-1 p-8 bg-white shadow-sm">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl dark:bg-black font-semibold text-gray-800">
            Students
          </h1>

          {/* from headless ui library */}
          <ClassSelect
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
          />

          <input
            type="text"
            value={search}
            placeholder="Search student..."
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Student
          </button>
        </div>

        {/* Download button */}
        <div className="flex justify-end mb-3">
          <CSVLink
            data={students}
            headers={headers}
            filename={"students.csv"}
            className="px-4 py-2 border text-green-500 border-green-600 hover:text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Download CSV
          </CSVLink>
        </div>

        {/* Reusable Table */}
        {/* {search.trim() === "" ? ( */}
        <Table
          data={students}
          columns={columns}
          onDelete={handleDelete}
          onView={handleView}
        />
        <StudentMap/>

        {/* <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold"> Find Students by City</h2>

      <div className="flex gap-3 items-center">
        <select
          className="border p-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Find Nearby Students
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {message !=="" && <p className="text-red-600">{message}</p> }

      {nearBystudents.length > 0 && (
        <ul className="space-y-2 mt-4">
          {nearBystudents.map((s) => (
            <li key={s._id} className="border p-2 rounded shadow-sm flex justify-between">
              <span>{s.name}</span>
              <span className="text-gray-500 text-sm">
                {s.location?.address || "No address"}
              </span>
              <span>{s.class}</span>
            </li>
          ))}
        </ul>
      )}
    </div> */}

        {/* ) : filteredStudents.length > 0 ? (
          <Table
            data={filteredStudents}
            columns={columns}
            onDelete={handleDelete}
            onView={handleView}
          />
        ) : (
          <p className="text-center text-gray-500">
            No students found matching "{search}"
          </p>
        )} */}
      </div>

      {/* Add Student Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Add Student
            </h2>

            <form className="space-y-4" onSubmit={handleAdd}>
              <input
                type="text"
                name="name"
                placeholder="Enter student name"
                value={newStudent.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={newStudent.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={newStudent.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />

              <div className="flex gap-2.5">
                <select
                  name="teacher"
                  value={newStudent.teacher}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>

                <select
                  name="courses"
                  value={newStudent.courses}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="class"
                  placeholder="Enter class"
                  pattern="^\d$"
                  value={newStudent.class}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  name="age"
                  placeholder="Enter age"
                  pattern="^\d{2}$"
                  value={newStudent.age}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter phone number"
                  pattern="^03\d{9}$"
                  title="Phone number must be 11 digits and start with 03"
                  value={newStudent.contact}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />

                <select
                  name="city"
                  className="w-full border p-2 rounded"
                  onChange={handleChange}
                  value={newStudent.city}
                  required
                >
                  <option value="">select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p className="font-semibold mb-1">Gender</p>
              <div className="flex gap-2">
                {options.map((option) => (
                  <label
                    className="flex items-center gap-1 justify-center"
                    htmlFor="gender"
                    key={option}
                  >
                    <input
                      type="radio"
                      name="gender"
                      required
                      value={option}
                      checked={gender === option}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>

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

      {/* View Student Details Modal */}
      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Student Details
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-2 py-1 hover:bg-red-500 hover:text-white rounded transition"
              >
                ✕
              </button>
            </div>

            {/* Show profile image if exists */}
            {selectedStudent.profileImage && (
              <div className="flex justify-center mb-4">
                <img
                  src={`https://schoolserver.up.railway.app/uploads/${selectedStudent.profileImage}`}
                  alt={selectedStudent.name}
                  className="w-24 h-24 rounded-full border"
                />
              </div>
            )}

            {/* Upload Profile Image */}
            <ProfileImageUpload
              uploadUrl="https://schoolserver.up.railway.app/api/students/upload-profile"
              entityId={selectedStudent._id}
              onUploadSuccess={(data) => {
                // Update student state with new profile image
                setStudents((prev) =>
                  prev.map((s) =>
                    s._id === data.student._id
                      ? { ...s, profileImage: data.student.profileImage }
                      : s
                  )
                );
                setSelectedStudent(data.student);
              }}
            />

            {/* Student Info Grid */}
            <div className="grid grid-cols-1 gap-4 text-gray-700">
              {Object.entries(selectedStudent).map(([key, value]) => {
                // Skip the 'id' field
                if (key === "_id") return null;

                // Handle nested 'details' object
                if (
                  key === "details" &&
                  typeof value === "object" &&
                  value !== null
                ) {
                  return (
                    <div key={key} className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800 capitalize mt-4">
                        {key}
                      </h3>
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <div
                          key={`${key}-${subKey}`}
                          className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                        >
                          <span className="capitalize font-medium">
                            {subKey}:
                          </span>
                          <span className="text-gray-800">
                            {subValue ?? "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }

                // Handle top-level properties
                return (
                  <div
                    key={key}
                    className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="capitalize font-medium">{key}:</span>
                    <span className="text-gray-800">{value ?? "N/A"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;

import React from "react";
import {
  createResult,
  deleteResult,
  getResultData,
} from "../../api/resultsApi";
import { useState, useEffect } from "react";
import Table from "../Table";
import { fetchResultsData } from "../../api/result-data";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/api";

// setted up data for sending to backend
// 1 loadData through api like teachers, students and courses
// 2 in select option display names but send _id as value for students and teachers and courses
const termOptions = ["Midterm", "Final", "Quiz", "Assignment", "Project"];

const Result = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  // const [search, setSearch] = useState("")

  const [formData, setFormData] = useState({
    student: "",
    teacher: "",
    course: "",
    marksObtained: "",
    totalMarks: "",
    term: "",
    remarks: "",
  });
  const token = localStorage.getItem("token");

  //  fetching teachers students courses in one api call,  lets make new endpoint which will send us all three data
  const fetchData = async () => {
    const res = await fetchResultsData(token);

    setTeachers(res.teachers);
    setStudents(res.students);
    setCourses(res.courses);
  };

  const getResults = async () => {
    const res = await getResultData(token);
    setResult(res);
  };

  useEffect(() => {
    fetchData();
    getResults();
  }, []);


  let searchTimeout;
//  search  (Debounce method to avoid unnecessary API hitting)

const handleSearch = (search) => {
  // Clear previous timer if user is still typing
  clearTimeout(searchTimeout);

  // Start a new timer only runs if user stops typing for 500ms
  searchTimeout = setTimeout(async () => {
    if (!search.trim()) {
      // if input is empty, reload all results
      getResults();
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/results?search=${search}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  }, 1000);
};




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "course") {
      const selectedCourse = courses.find((c) => c._id === value);
      if (selectedCourse && selectedCourse.students) {
        // Filter only students enrolled in this course
        setFilteredStudents(
          students.filter((s) => selectedCourse.students.includes(s._id))
        );
      } else {
        setFilteredStudents([]); // No course or no students
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultData = {
        student: formData.student,
        teacher: formData.teacher,
        course: formData.course,
        marksObtained: formData.marksObtained,
        totalMarks: formData.totalMarks,
        term: "Midterm",
        remarks: formData.remarks,
      };
      const token = localStorage.getItem("token");
      const savedResult = await createResult(resultData, token);
      console.log("result just saved", savedResult);

      setResult([...result, savedResult]);
      getResults();
      setFormData("");
      setIsOpen(false);
    } catch (err) {
      console.log("error creating result", err.message);
    }
  };

  const handleDelete = async (id) => {
    await deleteResult(token, id);
    const updated = result.filter((r) => r._id !== id);
    setResult(updated);
    toast.success("Result deleted successfully");
  };

  const columns = [
    { key: "student", label: "Student Name" },
    { key: "course", label: "Course" },
    { key: "marksObtained", label: "ObtMarks" },
    { key: "totalMarks", label: "TotMarks" },
    { key: "grade", label: "Grade" },
    { key: "term", label: "Term" },
    { key: "remarks", label: "Remarks" },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/results/upload-excel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      toast.success(data.message);
      getResults(); // refresh results table
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file");
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex-1 min-h-[90vh] mt-2">
          <div className="px-4 pt-4 ">
            <div className="flex justify-between mb-3">
              <h1 className="text-2xl dark:bg-black font-semibold text-gray-800">
                Result
              </h1>

              <input 
              type="text"
              onChange={(e)=>{handleSearch(e.target.value)}}
              placeholder="search student by name"
              className="border px-2 py-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                onClick={() => setIsOpen(true)}
                className="hover:cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Add Result
              </button>
            </div>

            <Table data={result} columns={columns} onDelete={handleDelete} />
          </div>
          <div className="flex justify-end mb-4 gap-3">
            <input
              type="file"
              accept=".xlsx,.csv"
              id="fileInput"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 cursor-pointer"
            >
              Upload Excel
            </label>
          </div>

          {isOpen && (
            <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Add Result
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="flex gap-3">
                    {/* Teacher dropdown */}
                    <select
                      name="teacher"
                      value={formData.teacher}
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
                      name="student"
                      value={formData.student}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    >
                      <option value="">Select Student</option>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No students in this course</option>
                      )}
                    </select>

                    <select
                      name="course"
                      value={formData.course}
                      className="border p-2 w-full rounded"
                      onChange={handleChange}
                    >
                      <option value="">select course</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 ">
                    <input
                      type="number"
                      name="marksObtained"
                      placeholder="Enter Marks"
                      value={formData.marksObtained}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />

                    <select
                      name="term"
                      value={formData.term}
                      onChange={handleChange}
                      className="w-[50%] outline-none border rounded-lg"
                    >
                      <option value="">Select Term</option>
                      {termOptions.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="number"
                    name="totalMarks"
                    placeholder="Enter Total Marks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />

                  <textarea
                    value={formData.remarks}
                    onChange={handleChange}
                    name="remarks"
                    id=""
                    placeholder="Enter Remarks"
                    className="w-full border rounded-xl p-2 min-h-[100px] resize-x focus:ring-blue-500 "
                  ></textarea>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setFormData("");
                      }}
                      className="hover:cursor-pointer px-4 py-2 border border-red-500 text-red-500 rounded-lg shadow hover:bg-gray-200 transition"
                    >
                      close
                    </button>
                    <button
                      type="submit"
                      className="hover:cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;

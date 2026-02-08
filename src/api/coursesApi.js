import axios from "axios";

const API_URL = "https://schoolserver.up.railway.app/api/courses";

export const createCourse = async (courseData, token) => {
  const res = await axios.post(API_URL, courseData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const getAllCourses = async(token)=>{

    const res = await axios.get(API_URL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}


export const deleteCourseById = async(token,id)=>{
    const res = await axios.delete(`${API_URL}/${id}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
}
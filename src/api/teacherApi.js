import { API_BASE_URL } from "../utils/api";

const API_URL =  `${API_BASE_URL}/api/teachers`; 

export const createTeacher = async(teacherData,token) => {
    const res = await fetch(API_URL,{
        method: "POST",
        headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
           
        body: JSON.stringify(teacherData)
    })
    return res.json()
}

// GET all teachers

export const getTeachers = async(token)=> {
    const teachers = await fetch(API_URL,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

    })
   return teachers.json();

}


// delete teacher

export const deleteTeacher = async(id,token)=>{
    const res = await fetch(`${API_URL}/${id}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
    })
    return res.json()
}
const API_URL = "https://schoolserver.up.railway.app/api/students"; 


// src/api/studentApi.js
export async function getStudents(filters = {}) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(filters); // converts {search: "Ali"} → search=Ali
  const res = await fetch(`https://schoolserver.up.railway.app/api/students?${params.toString()}`,{
    headers: {
      Authorization: `Bearer ${token}`, // ✅ attach token
      "Content-Type": "application/json",
    },  
  });
  return res.json();
}




export const createStudent = async (student, token) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(student)
  });
  return res.json();
};



export const deleteStudent = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

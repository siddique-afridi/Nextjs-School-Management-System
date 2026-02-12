import { API_BASE_URL } from "../utils/api";


export const getDashboardData = async () => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${API_BASE_URL}/api/dashboard-stats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
  
    return res.json();
  };
  
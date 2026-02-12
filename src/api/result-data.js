
import { API_BASE_URL } from "../utils/api";

export const fetchResultsData = async (token) => {
    const res = await fetch(`${API_BASE_URL}/api/result-data`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch results data");
    return res.json();
  };
  
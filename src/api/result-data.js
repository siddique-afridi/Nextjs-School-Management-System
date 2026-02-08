

export const fetchResultsData = async (token) => {
    const res = await fetch("https://schoolserver.up.railway.app/api/result-data",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch results data");
    return res.json();
  };
  
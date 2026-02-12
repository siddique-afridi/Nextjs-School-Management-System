import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { API_BASE_URL } from "../../utils/api";

// Optional: fix missing marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });
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

const StudentMap = () => {
  const [students, setStudents] = useState([]);
  const [city, setCity] = useState("");
  const [totalStudents, setTotalStudents] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!city) {
      // ⛔ Stop execution when city is empty
      setStudents([]);
      setTotalStudents(0);
      setMessage("");
      return;
    }
    // Fetch students by city (from backend)
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/students/nearbyCity?city=${city}`
        );
        const data = await res.json();
        setStudents(data.students);
        setTotalStudents(data.count);
        setMessage(data.message);
        console.log(data.message);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [city]);

  return (
    <div className="p-4">
      <div className="flex gap-5 justify-center mb-4">
        <select
          className="border p-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">select city</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

      </div>
        <div className="text-center mb-2">
          {!city ? null : message ? (
            <p className="text-red-600 font-medium">{message}</p>
          ) : (
            <div className="text-green-600">
              Total Students in {city} : {totalStudents}
            </div>
          )}
        </div>
      {/* {message !=="" && <p className="text-red-600">{message}</p> } */}
      {loading && <p>Loading...</p>}

      <MapContainer
        center={[24.8607, 67.0011]} // Karachi default
        zoom={6}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {students.map((s) => (
          <Marker
            key={s._id}
            position={[s.location.coordinates[1], s.location.coordinates[0]]}
          >
            <Popup>
              <strong>{s.name}</strong>
              <br />
              {s.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StudentMap;

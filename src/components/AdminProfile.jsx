import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const navigate = useNavigate();
  // Initial state (can come from API/localStorage later)
  const [admin, setAdmin] = useState({
    name: "John Doe",
    email: "admin@example.com",
    role: "Administrator",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(admin);
  const [name, setName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log({...admin})
    // admin[name] = value
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setAdmin(formData); // update admin details
    setIsEditing(false);
    localStorage.setItem("admin", JSON.stringify(formData));
    // later you can save this to API or localStorage
  };

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      const parsedAdmin = JSON.parse(savedAdmin);
      setAdmin(parsedAdmin);
      setFormData(parsedAdmin);
    }
  }, []);

  return (
    <>
      <div className="border border-white/30 backdrop-blur-lg  p-4 mx-auto flex gap-4 h-[85vh] w-[75vw] justify-center rounded-3xl">
        <div className=" p-8 bg-white rounded-xl w-[45%] h-[100%] self-start flex flex-col justify-center shadow-2xl">
          <div className="flex justify-start w-full">
            <button
              onClick={() => navigate(-1)}
              className=" text-2xl  hover:cursor-pointer"
            >
              ←
            </button>
          </div>
          <div className="flex justify-center">
            <img
              className="w-[30%]"
              src="/src/assets/vecteezy_customer-satisfaction-give-5-stars-rating-feedback_36895712.png"
              alt=""
            />
          </div>

          <h1 className="text-2xl font-bold mt-2.5 self-start">My Profile</h1>
          <span>I am admin of this school</span>
          <div className="mt-5 flex flex-col text-left items-start">
            <div className="flex justify-between w-full items-center">
            <p className="font-semibold">
              {admin.name}
            </p>

              <span className="p-3  font-normal">+971 768 98787678</span>
            </div>
           <div className="p-[1px] bg-gray-300 w-full mt-2"></div>
            <p className="mt-5">
              {admin.email}

            </p>
            <div className="p-[1px] bg-gray-300 w-full mt-2"></div>
            <p className="mt-5">
              <b>{admin.role}</b> 
            </p>
            <div className="p-[1px] bg-gray-300 w-full mt-2"></div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-2 py-2 bg-blue-600 text-white rounded-lg w-[25%] self-center"
          >
            Edit Profile
          </button>
        </div>

        <div className=" w-[40%] flex gap-5 justify-center items-center flex-col h-[80vh]">
          <div className="bg-white w-[90%] h-[50%] p-8 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Bank Account</h2>
              <button className="px-2 py-1 bg-gray-200 rounded-2xl w-20 text-black">
                Edit
              </button>
            </div>
            <div className="text-2xl bg-gray-300 p-[1px] rounded-full mt-4 "></div>

            <div className="flex justify-between items-center mt-5">
              <div className="mt-3">
                <h4 className="font-semibold">Active Account</h4>
                <p className="text-gray-500">00 879 46327 klp</p>
              </div>
              <button className="w-32 text-[12px] px-4 py-1 bg-amber-300 rounded-2xl">
                Bank Account
              </button>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="mt-3">
                <h4 className="font-semibold">Blocked Account</h4>
                <p className="text-gray-500">00 279 59327 fgt</p>
              </div>
              <button className="bg-green-400 w-32 text-[12px] px-4 py-1 rounded-2xl">
                Unblock Account
              </button>
            </div>
          </div>
          <div className="bg-white w-[90%] h-[50%] p-8 rounded-xl shadow-2xl">
            <div className="flex justify-between">
              <h4 className="text-2xl font-bold">My Bills</h4>
              <button className="px-2 py-1 bg-gray-200 rounded-2xl w-20 text-black">filter</button>
            </div>
            <div className="text-2xl bg-gray-300 p-[1px] rounded-full mt-4 "></div>

            
              <div className="flex justify-between mt-4 ">
                <div>
                <p>Internet bill</p>
                </div>
                <button className="text-[12px] px-3 py-1 bg-green-300 rounded-2xl">Bill Paid</button>
              </div>
            
              <div className="flex justify-between mt-4 ">
                <div>
                <p>Grocery bill</p>
                </div>
                <button className="text-[12px] px-3 py-1 bg-green-300 rounded-2xl">Bill Paid</button>
              </div>
            
              <div className="flex justify-between mt-4 ">
                <div>
                <p>Electricity bill</p>
                </div>
                <button className="text-white text-[11px] px-3 py-1 bg-red-500 rounded-2xl">Not Paid</button>
              </div>
            
              <div className="flex justify-between mt-4 ">
                <div>
                <p className="text-">Gas bill</p>
                </div>
                <button className="text-[12px] px-3 py-1 bg-green-300 rounded-2xl">Bill Paid</button>
              </div>
            
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center bg-black/50 justify-center bg-opacity-50 backdrop-blur-sm z-50">
          <div className="p-6 bg-white rounded-lg shadow w-[40%] flex self-center">
            <form onSubmit={handleSave} className="space-y-4 w-[100%]">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg w-full"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg w-full"
                placeholder="Email"
              />
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="border px-3 py-2 rounded-lg w-full"
                placeholder="Role"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProfile;

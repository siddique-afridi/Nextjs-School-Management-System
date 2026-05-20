import React from 'react'
import { useState } from "react";


export const ProfileImageUpload = ({ uploadUrl, entityId, onUploadSuccess }) => {
    const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("id", entityId); // backend expects studentId / teacherId
    formData.append("profileImage", file);

    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile uploaded!");
        onUploadSuccess?.(data); // notify parent
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-20 h-20 rounded-full object-cover border"
        />
      )}
      <button
        type="button"
        onClick={handleUpload}
        className="px-4 py-1 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
};
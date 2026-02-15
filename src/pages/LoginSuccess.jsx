import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";

function LoginSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasRun = useRef(false); // prevent double execution

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [login, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-700">
      <p>Signing you in with Google...</p>
    </div>
  );
}

export default LoginSuccess;

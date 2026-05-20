import { createContext, useContext, useState,useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);
}, []);

const login = (token)=>{
 
    if(token){
        localStorage.setItem("token", token );
        setIsLoggedIn(true)
        return true
    }else{
        return false
    }
}
const logout = ()=>{
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
}

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
        {children}
        </AuthContext.Provider>
    )
}
export function useAuth(){
    return useContext(AuthContext)
}
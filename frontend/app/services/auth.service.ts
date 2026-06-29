import client from "@/lib/client";
import { LoginForm } from "../schemas/loginSchema";


export interface LoginResponse {    
  message: string;
  token: string;
  user: {
    _id: string;    
    name: string;
    email: string;
    schoolName: string;
    role: string;
  }
}

export async function login(data: LoginForm):Promise<LoginResponse>{
    const response = await client.post<LoginResponse>('/AdminLogin', data)

    return response.data;
} 


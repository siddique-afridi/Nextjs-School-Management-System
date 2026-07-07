import client from "@/lib/client";
import {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  UserRole,
} from "@/lib/constants";

interface TeacherLoginResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  school?: { _id: string; schoolName: string };
  teachSubject?: { _id: string; subName: string; sessions?: string };
  teachSclass?: { _id: string; sclassName: string };
  message?: string;
}

interface StudentLoginResponse {
  _id: string;
  name: string;
  rollNum: number;
  role: string;
  school?: { _id: string; schoolName: string };
  sclassName?: { _id: string; sclassName: string };
  message?: string;
}

function mapAdminUser(user: LoginResponse["user"]): AuthUser {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    schoolName: user.schoolName,
  };
}

function mapTeacherUser(teacher: TeacherLoginResponse): AuthUser {
  return {
    _id: teacher._id,
    name: teacher.name,
    email: teacher.email,
    role: UserRole.TEACHER,
    school: teacher.school,
    teachSubject: teacher.teachSubject,
    teachSclass: teacher.teachSclass,
  };
}

function mapStudentUser(student: StudentLoginResponse): AuthUser {
  return {
    _id: student._id,
    name: student.name,
    role: UserRole.STUDENT,
    rollNum: student.rollNum,
    school: student.school,
    sclassName: student.sclassName,
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<{ user: AuthUser; token?: string }> {
  const { role, email, password, rollNum, studentName } = credentials;

  if (role === UserRole.ADMIN) {
    const response = await client.post<LoginResponse>("/AdminLogin", {
      email,
      password,
    });
    return {
      user: mapAdminUser(response.data.user),
      token: response.data.token,
    };
  }

  if (role === UserRole.TEACHER) {
    const response = await client.post<TeacherLoginResponse>("/TeacherLogin", {
      email,
      password,
    });
    if (response.data.message) {
      throw new Error(response.data.message);
    }
    return { user: mapTeacherUser(response.data) };
  }

  const response = await client.post<StudentLoginResponse>("/StudentLogin", {
    rollNum: Number(rollNum),
    studentName,
    password,
  });
  if (response.data.message) {
    throw new Error(response.data.message);
  }
  return { user: mapStudentUser(response.data) };
}

export async function getMe(): Promise<AuthUser> {
  const response = await client.get<AuthUser>("/Me");
  return {
    ...response.data,
    role: UserRole.ADMIN,
  };
}

export async function logoutApi(): Promise<void> {
  await client.post("/Logout");
}

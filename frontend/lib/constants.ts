// User Roles
export enum UserRole {
  ADMIN = "Admin",
  TEACHER = "Teacher",
  STUDENT = "Student",
}

// Types for data models
export interface User {
  _id: string;
  name: string;
  email?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

/** Extended user shape stored in auth context after login */
export interface AuthUser extends User {
  schoolName?: string;
  school?: { _id: string; schoolName: string };
  rollNum?: number;
  sclassName?: { _id: string; sclassName: string };
  teachSubject?: { _id: string; subName: string; sessions?: string };
  teachSclass?: { _id: string; sclassName: string };
  examResult?: unknown[];
  attendance?: unknown[];
}

export interface Admin extends User {
  role: UserRole.ADMIN;
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  employeeId: string;
  subject?: Subject;
  assignedClass?: Class;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  studentId: string;
  class: Class;
  dob?: string;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  teacher?: Teacher;
  students?: Student[];
  subjects?: Subject[];
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher?: Teacher;
  createdAt: Date;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdBy: Admin;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Attendance {
  id: string;
  student: Student;
  date: Date;
  status: "present" | "absent";
  subject: Subject;
}

export interface ExamResult {
  id: string;
  student: Student;
  subject: Subject;
  marks: number;
  totalMarks: number;
  date: Date;
}

export interface Complaint {
  id: string;
  student: Student;
  title: string;
  description: string;
  status: "pending" | "resolved";
  createdAt: Date;
  resolvedAt?: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export interface LoginCredentials {
  role: UserRole;
  email?: string;
  password: string;
  rollNum?: string;
  studentName?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  totalNotices: number;
  totalComplaints: number;
}

export interface LoginResponse {    
  message: string;
  token: string;
  user: {
    _id: string;    
    name: string;
    email: string;
    schoolName: string;
    role: UserRole;
  }
}
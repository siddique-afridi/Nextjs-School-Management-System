// User Roles
export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

// Types for data models
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
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
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
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

import {
  UserRole,
  Class,
  Subject,
  Teacher,
  Student,
  Notice,
  Attendance,
  ExamResult,
  Complaint,
} from "./constants";

// Mock Subjects
export const mockSubjects: Subject[] = [
  { id: "1", name: "Mathematics", code: "MATH101", createdAt: new Date() },
  { id: "2", name: "English", code: "ENG101", createdAt: new Date() },
  { id: "3", name: "Science", code: "SCI101", createdAt: new Date() },
  { id: "4", name: "History", code: "HIST101", createdAt: new Date() },
  { id: "5", name: "Geography", code: "GEO101", createdAt: new Date() },
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    id: "t1",
    name: "John Smith",
    email: "john.smith@school.com",
    phone: "+1234567890",
    role: UserRole.TEACHER,
    employeeId: "EMP001",
    subject: mockSubjects[0],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "t2",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.com",
    phone: "+1234567891",
    role: UserRole.TEACHER,
    employeeId: "EMP002",
    subject: mockSubjects[1],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "t3",
    name: "Michael Brown",
    email: "michael.brown@school.com",
    phone: "+1234567892",
    role: UserRole.TEACHER,
    employeeId: "EMP003",
    subject: mockSubjects[2],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  {
    id: "c1",
    name: "Class 10-A",
    description: "Advanced students",
    teacher: mockTeachers[0],
    subjects: [mockSubjects[0], mockSubjects[1]],
    createdAt: new Date(),
    students: [],
  },
  {
    id: "c2",
    name: "Class 10-B",
    description: "Regular students",
    teacher: mockTeachers[1],
    subjects: [mockSubjects[2], mockSubjects[3]],
    createdAt: new Date(),
    students: [],
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alice Johnson",
    email: "alice.johnson@student.com",
    phone: "+1111111111",
    role: UserRole.STUDENT,
    studentId: "STU001",
    class: mockClasses[0],
    dob: "2008-05-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
  {
    id: "s2",
    name: "Bob Smith",
    email: "bob.smith@student.com",
    phone: "+1111111112",
    role: UserRole.STUDENT,
    studentId: "STU002",
    class: mockClasses[0],
    dob: "2008-08-22",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
  {
    id: "s3",
    name: "Carol Davis",
    email: "carol.davis@student.com",
    phone: "+1111111113",
    role: UserRole.STUDENT,
    studentId: "STU003",
    class: mockClasses[0],
    dob: "2008-11-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
  },
  {
    id: "s4",
    name: "David Wilson",
    email: "david.wilson@student.com",
    phone: "+1111111114",
    role: UserRole.STUDENT,
    studentId: "STU004",
    class: mockClasses[1],
    dob: "2008-03-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: "s5",
    name: "Emma Taylor",
    email: "emma.taylor@student.com",
    phone: "+1111111115",
    role: UserRole.STUDENT,
    studentId: "STU005",
    class: mockClasses[1],
    dob: "2008-07-08",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
];

// Add students to classes
mockClasses[0].students = [mockStudents[0], mockStudents[1], mockStudents[2]];
mockClasses[1].students = [mockStudents[3], mockStudents[4]];

// Mock Notices
export const mockNotices: Notice[] = [
  {
    id: "n1",
    title: "Annual Sports Day",
    content:
      "The annual sports day will be held on June 15th. All students are requested to participate.",
    createdBy: {
      id: "admin1",
      name: "Admin User",
      email: "admin@school.com",
      role: UserRole.ADMIN,
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "n2",
    title: "Summer Vacation Schedule",
    content:
      "Summer vacation starts from June 1st and ends on July 31st. Classes will resume on August 1st.",
    createdBy: {
      id: "admin1",
      name: "Admin User",
      email: "admin@school.com",
      role: UserRole.ADMIN,
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: "n3",
    title: "Parent-Teacher Meeting",
    content:
      "The parent-teacher meeting will be held on May 20th in the school auditorium. Parents are requested to attend.",
    createdBy: {
      id: "admin1",
      name: "Admin User",
      email: "admin@school.com",
      role: UserRole.ADMIN,
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
];

// Mock Attendance
export const mockAttendance: Attendance[] = [
  {
    id: "a1",
    student: mockStudents[0],
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "present",
    subject: mockSubjects[0],
  },
  {
    id: "a2",
    student: mockStudents[0],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "present",
    subject: mockSubjects[0],
  },
  {
    id: "a3",
    student: mockStudents[0],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "absent",
    subject: mockSubjects[0],
  },
  {
    id: "a4",
    student: mockStudents[1],
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "present",
    subject: mockSubjects[0],
  },
  {
    id: "a5",
    student: mockStudents[1],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "present",
    subject: mockSubjects[0],
  },
];

// Mock Exam Results
export const mockExamResults: ExamResult[] = [
  {
    id: "r1",
    student: mockStudents[0],
    subject: mockSubjects[0],
    marks: 85,
    totalMarks: 100,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r2",
    student: mockStudents[0],
    subject: mockSubjects[1],
    marks: 78,
    totalMarks: 100,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r3",
    student: mockStudents[1],
    subject: mockSubjects[0],
    marks: 92,
    totalMarks: 100,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "r4",
    student: mockStudents[1],
    subject: mockSubjects[1],
    marks: 88,
    totalMarks: 100,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

// Mock Complaints
export const mockComplaints: Complaint[] = [
  {
    id: "comp1",
    student: mockStudents[0],
    title: "Lab Equipment Issue",
    description: "The microscope in the science lab is not working properly. Please fix it.",
    status: "resolved",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "comp2",
    student: mockStudents[1],
    title: "Canteen Food Quality",
    description:
      "The food quality in the canteen has deteriorated recently. Please address this issue.",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "comp3",
    student: mockStudents[2],
    title: "Classroom Lighting",
    description: "Some lights in classroom 10-A are not working. It's hard to see the board.",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

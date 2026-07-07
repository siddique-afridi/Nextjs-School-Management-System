import { Class, Complaint, Notice, Student, Subject, Teacher, UserRole } from "./constants";

// These functions convert MongoDB API shape → UI shape your pages expect.

export function mapClass(raw: Record<string, unknown>): Class {
  return {
    id: String(raw._id),
    name: String(raw.sclassName ?? ""),
    description: "",
    createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : new Date(),
  };
}

export function mapSubject(raw: Record<string, unknown>): Subject {
  const teacher = raw.teacher as Record<string, unknown> | undefined;
  const sclass = raw.sclassName as Record<string, unknown> | string | undefined;
  return {
    id: String(raw._id),
    name: String(raw.subName ?? ""),
    code: String(raw.subCode ?? ""),
    createdAt: raw.createdAt ? new Date(String(raw.createdAt)) : new Date(),
    teacher: teacher?._id
      ? {
          _id: String(teacher._id),
          id: String(teacher._id),
          name: String(teacher.name ?? ""),
          email: String(teacher.email ?? ""),
          role: UserRole.TEACHER,
          employeeId: String(teacher._id).slice(-6),
        }
      : undefined,
    // extra info for forms
    classId: typeof sclass === "object" && sclass?._id ? String(sclass._id) : String(sclass ?? ""),
    className:
      typeof sclass === "object" && sclass?.sclassName
        ? String(sclass.sclassName)
        : "",
    sessions: String(raw.sessions ?? ""),
  } as Subject & { classId?: string; className?: string; sessions?: string };
}

export function mapStudent(raw: Record<string, unknown>): Student & { id: string } {
  const sclass = raw.sclassName as Record<string, unknown> | undefined;
  return {
    id: String(raw._id),
    _id: String(raw._id),
    name: String(raw.name ?? ""),
    email: "",
    role: UserRole.STUDENT,
    studentId: String(raw.rollNum ?? ""),
    class: sclass
      ? { id: String(sclass._id), name: String(sclass.sclassName ?? "") }
      : { id: "", name: "-" },
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${raw.name}`,
  };
}

export function mapTeacher(raw: Record<string, unknown>): Teacher & { id: string } {
  const subject = raw.teachSubject as Record<string, unknown> | undefined;
  const sclass = raw.teachSclass as Record<string, unknown> | undefined;
  return {
    id: String(raw._id),
    _id: String(raw._id),
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    role: UserRole.TEACHER,
    employeeId: String(raw._id).slice(-6).toUpperCase(),
    subject: subject
      ? {
          id: String(subject._id),
          name: String(subject.subName ?? ""),
          code: "",
          createdAt: new Date(),
        }
      : undefined,
    assignedClass: sclass
      ? { id: String(sclass._id), name: String(sclass.sclassName ?? "") }
      : undefined,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${raw.name}`,
  };
}

export function mapNotice(raw: Record<string, unknown>): Notice {
  return {
    id: String(raw._id),
    title: String(raw.title ?? ""),
    content: String(raw.details ?? ""),
    createdBy: { _id: "", name: "Admin", role: UserRole.ADMIN } as Notice["createdBy"],
    createdAt: raw.date ? new Date(String(raw.date)) : new Date(),
  };
}

export function mapComplaint(raw: Record<string, unknown>): Complaint {
  const user = raw.user as Record<string, unknown> | undefined;
  return {
    id: String(raw._id),
    student: {
      _id: String(user?._id ?? ""),
      id: String(user?._id ?? ""),
      name: String(user?.name ?? "Unknown"),
      role: UserRole.STUDENT,
      studentId: "",
      class: { id: "", name: "-" },
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`,
    } as Student & { id: string },
    title: "Complaint",
    description: String(raw.complaint ?? ""),
    status: "pending",
    createdAt: raw.date ? new Date(String(raw.date)) : new Date(),
  };
}

import client from "@/lib/client";
import { AuthUser, LoginCredentials, LoginResponse, UserRole } from "@/lib/constants";

type ApiUser = Record<string, unknown>;

interface AuthApiResponse {
  message: string;
  user: ApiUser;
  token?: string;
}

export function mapApiUserToAuthUser(data: ApiUser): AuthUser {
  const role = String(data.role ?? "Admin") as UserRole;

  if (role === UserRole.ADMIN) {
    return {
      _id: String(data._id),
      name: String(data.name),
      email: String(data.email ?? ""),
      role: UserRole.ADMIN,
      schoolName: String(data.schoolName ?? ""),
    };
  }

  if (role === UserRole.TEACHER) {
    const teachSubject = data.teachSubject as ApiUser | undefined;
    const teachSclass = data.teachSclass as ApiUser | undefined;
    const school = data.school as ApiUser | undefined;
    return {
      _id: String(data._id),
      name: String(data.name),
      email: String(data.email ?? ""),
      role: UserRole.TEACHER,
      school: school?._id
        ? { _id: String(school._id), schoolName: String(school.schoolName ?? "") }
        : undefined,
      teachSubject: teachSubject?._id
        ? {
            _id: String(teachSubject._id),
            subName: String(teachSubject.subName ?? ""),
            sessions: teachSubject.sessions ? String(teachSubject.sessions) : undefined,
          }
        : undefined,
      teachSclass: teachSclass?._id
        ? { _id: String(teachSclass._id), sclassName: String(teachSclass.sclassName ?? "") }
        : undefined,
    };
  }

  const sclassName = data.sclassName as ApiUser | undefined;
  const school = data.school as ApiUser | undefined;
  return {
    _id: String(data._id),
    name: String(data.name),
    role: UserRole.STUDENT,
    rollNum: Number(data.rollNum ?? 0),
    school: school?._id
      ? { _id: String(school._id), schoolName: String(school.schoolName ?? "") }
      : undefined,
    sclassName: sclassName?._id
      ? { _id: String(sclassName._id), sclassName: String(sclassName.sclassName ?? "") }
      : undefined,
    examResult: (data.examResult as unknown[]) ?? [],
    attendance: (data.attendance as unknown[]) ?? [],
  };
}

export async function login(
  credentials: LoginCredentials,
): Promise<{ user: AuthUser; token?: string }> {
  const { role, email, password, rollNum, studentName } = credentials;

  if (role === UserRole.ADMIN) {
    const response = await client.post<LoginResponse>("/AdminLogin", { email, password });
    return {
      user: mapApiUserToAuthUser(response.data.user as unknown as ApiUser),
      token: response.data.token,
    };
  }

  if (role === UserRole.TEACHER) {
    const response = await client.post<AuthApiResponse>("/TeacherLogin", { email, password });
    return {
      user: mapApiUserToAuthUser(response.data.user),
      token: response.data.token,
    };
  }

  const response = await client.post<AuthApiResponse>("/StudentLogin", {
    rollNum: Number(rollNum),
    studentName,
    password,
  });
  return {
    user: mapApiUserToAuthUser(response.data.user),
    token: response.data.token,
  };
}

export async function getMe(): Promise<AuthUser> {
  const response = await client.get<ApiUser>("/Me");
  return mapApiUserToAuthUser(response.data);
}

export async function logoutApi(): Promise<void> {
  await client.post("/Logout");
}

import client from "@/lib/client";
import { asList, throwIfMessage } from "@/lib/api-helpers";
import { mapTeacher } from "@/lib/mappers";

export async function fetchTeachers(schoolId: string) {
  const res = await client.get(`/Teachers/${schoolId}`);
  return asList(res.data).map((item) => mapTeacher(item as Record<string, unknown>));
}

export async function createTeacher(
  schoolId: string,
  data: {
    name: string;
    email: string;
    password: string;
    classId: string;
    subjectId: string;
  },
) {
  const res = await client.post("/TeacherReg", {
    name: data.name,
    email: data.email,
    password: data.password,
    role: "Teacher",
    school: schoolId,
    teachSclass: data.classId,
    teachSubject: data.subjectId,
  });
  throwIfMessage(res.data);
  return mapTeacher(res.data as Record<string, unknown>);
}

export async function deleteTeacher(teacherId: string) {
  await client.delete(`/Teacher/${teacherId}`);
}

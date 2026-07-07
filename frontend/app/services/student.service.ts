import client from "@/lib/client";
import { asList, throwIfMessage } from "@/lib/api-helpers";
import { mapStudent } from "@/lib/mappers";

export async function fetchStudents(schoolId: string) {
  const res = await client.get(`/Students/${schoolId}`);
  return asList(res.data).map((item) =>
    mapStudent(item as Record<string, unknown>)
  );
}

export async function createStudent(
  schoolId: string,
  data: { name: string; rollNum: string; password: string; classId: string }
) {
  const res = await client.post("/StudentReg", {
    name: data.name,
    rollNum: Number(data.rollNum),
    password: data.password,
    sclassName: data.classId,
    adminID: schoolId,
  });
  throwIfMessage(res.data);
  return mapStudent(res.data as Record<string, unknown>);
}

export async function deleteStudent(studentId: string) {
  await client.delete(`/Student/${studentId}`);
}

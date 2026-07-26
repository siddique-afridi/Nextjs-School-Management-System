import client from "@/lib/client";
import { asList, throwIfMessage } from "@/lib/api-helpers";
import { mapSubject } from "@/lib/mappers";

export async function fetchSubjects(schoolId: string) {
  const res = await client.get(`/AllSubjects/${schoolId}`);
  return asList(res.data).map((item) => mapSubject(item as Record<string, unknown>));
}

export async function createSubject(
  schoolId: string,
  data: { name: string; code: string; sessions: string; classId: string },
) {
  const res = await client.post("/SubjectCreate", {
    adminID: schoolId,
    sclassName: data.classId,
    subjects: [{ subName: data.name, subCode: data.code, sessions: data.sessions }],
  });
  throwIfMessage(res.data);
  const list = asList(res.data);
  return mapSubject(list[0] as Record<string, unknown>);
}

export async function deleteSubject(subjectId: string) {
  await client.delete(`/Subject/${subjectId}`);
}

import client from "@/lib/client";
import { asList } from "@/lib/api-helpers";
import { mapStudent } from "@/lib/mappers";

/** Teacher portal API calls — kept separate from admin services for clarity */
export async function fetchClassStudents(classId: string) {
  const res = await client.get(`/Sclass/Students/${classId}`);
  return asList(res.data).map((item) => mapStudent(item as Record<string, unknown>));
}

export async function markStudentAttendance(
  studentId: string,
  data: { subjectId: string; status: "Present" | "Absent"; date: string },
) {
  await client.put(`/StudentAttendance/${studentId}`, {
    subName: data.subjectId,
    status: data.status,
    date: data.date,
  });
}

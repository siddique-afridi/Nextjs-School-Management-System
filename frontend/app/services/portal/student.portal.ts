import client from "@/lib/client";
import { asList } from "@/lib/api-helpers";
import { mapComplaint, mapNotice } from "@/lib/mappers";
import { Attendance, ExamResult } from "@/lib/constants";

type RawRecord = Record<string, unknown>;

export async function fetchStudentProfile(studentId: string) {
  const res = await client.get(`/Student/${studentId}`);
  return res.data as RawRecord;
}

export async function fetchSchoolNotices(schoolId: string) {
  const res = await client.get(`/NoticeList/${schoolId}`);
  return asList(res.data).map((item) => mapNotice(item as RawRecord));
}

export async function fetchMyComplaints() {
  const res = await client.get("/MyComplaints");
  return asList(res.data).map((item) => mapComplaint(item as RawRecord));
}

export async function submitComplaint(text: string) {
  const res = await client.post("/ComplainCreate", { complaint: text, date: new Date() });
  return mapComplaint(res.data as RawRecord);
}

/** Map backend attendance array → UI table rows */
export function mapAttendanceRows(raw: RawRecord[]): Attendance[] {
  return raw.map((item, index) => {
    const subject = item.subName as RawRecord | undefined;
    const status = String(item.status ?? "Absent").toLowerCase() as "present" | "absent";
    return {
      id: `${index}-${String(item.date)}`,
      student: { _id: "", name: "", role: "Student" as never, studentId: "", class: { id: "", name: "" } },
      date: new Date(String(item.date)),
      status,
      subject: {
        id: String(subject?._id ?? ""),
        name: String(subject?.subName ?? "Subject"),
        code: "",
        createdAt: new Date(),
      },
    };
  });
}

/** Map backend exam results → UI cards/table */
export function mapExamResultRows(raw: RawRecord[]): ExamResult[] {
  return raw.map((item, index) => {
    const subject = item.subName as RawRecord | undefined;
    const marks = Number(item.marksObtained ?? 0);
    const totalMarks = 100;
    return {
      id: String(subject?._id ?? index),
      student: { _id: "", name: "", role: "Student" as never, studentId: "", class: { id: "", name: "" } },
      subject: {
        id: String(subject?._id ?? ""),
        name: String(subject?.subName ?? "Subject"),
        code: "",
        createdAt: new Date(),
      },
      marks,
      totalMarks,
      date: new Date(),
    };
  });
}

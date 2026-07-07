import client from "@/lib/client";
import { asList } from "@/lib/api-helpers";
import { mapNotice } from "@/lib/mappers";

export async function fetchNotices(schoolId: string) {
  const res = await client.get(`/NoticeList/${schoolId}`);
  return asList(res.data).map((item) =>
    mapNotice(item as Record<string, unknown>)
  );
}

export async function createNotice(
  schoolId: string,
  data: { title: string; content: string }
) {
  const res = await client.post("/NoticeCreate", {
    title: data.title,
    details: data.content,
    date: new Date(),
    adminID: schoolId,
  });
  return mapNotice(res.data as Record<string, unknown>);
}

export async function deleteNotice(noticeId: string) {
  await client.delete(`/Notice/${noticeId}`);
}

import client from "@/lib/client";
import { asList } from "@/lib/api-helpers";
import { mapComplaint } from "@/lib/mappers";

export async function fetchComplaints(schoolId: string) {
  const res = await client.get(`/ComplainList/${schoolId}`);
  return asList(res.data).map((item) => mapComplaint(item as Record<string, unknown>));
}

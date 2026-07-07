import client from "@/lib/client";
import { asList, throwIfMessage } from "@/lib/api-helpers";
import { mapClass } from "@/lib/mappers";
import { Class } from "@/lib/constants";

export async function fetchClasses(schoolId: string): Promise<Class[]> {
  const res = await client.get(`/SclassList/${schoolId}`);
  return asList(res.data).map((item) => mapClass(item as Record<string, unknown>));
}

export async function createClass(schoolId: string, name: string): Promise<Class> {
  const res = await client.post("/SclassCreate", {
    sclassName: name,
    adminID: schoolId,
  });
  throwIfMessage(res.data);
  return mapClass(res.data as Record<string, unknown>);
}

export async function deleteClass(classId: string): Promise<void> {
  await client.delete(`/Sclass/${classId}`);
}

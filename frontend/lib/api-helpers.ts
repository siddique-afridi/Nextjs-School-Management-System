/** Backend sometimes returns an array OR { message: "No x found" } */
export function asList<T>(data: T[] | { message?: string }): T[] {
  return Array.isArray(data) ? data : [];
}

/** Backend sometimes returns { message: "error text" } on failed create */
export function throwIfMessage(data: unknown): void {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    !("_id" in data) &&
    !Array.isArray(data)
  ) {
    throw new Error(String((data as { message: string }).message));
  }
}

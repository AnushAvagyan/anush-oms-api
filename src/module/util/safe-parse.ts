export function safeParse<T = any>(data: string): T | undefined {
  try {
    return JSON.parse(data);
  } catch (err: any) {
    return undefined;
  }
}

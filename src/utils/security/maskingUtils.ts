export function maskSensitiveData(data: string) {
  data = '*'.repeat(data.length);
  return data;
}

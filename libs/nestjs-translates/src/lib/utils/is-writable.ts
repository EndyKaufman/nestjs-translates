// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isWritable<T = any>(obj: T, key: keyof T) {
  const desc = Object.getOwnPropertyDescriptor(obj, key) || {};
  return Boolean(desc.writable);
}

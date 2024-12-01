const localGlobal = {};
/**
 * This function returns the global object across Node and browsers.
 *
 * Note: `globalThis` is the standardized approach however it has been added to
 * Node.js in version 12. We need to include this snippet until Node 12 EOL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGlobal<T = any>(): T {
  if (typeof globalThis !== 'undefined') {
    return globalThis as unknown as T;
  }

  if (typeof global !== 'undefined') {
    return global as unknown as T;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'window'.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Cannot find name 'window'.
    return window as unknown as T;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Cannot find name 'self'.
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Cannot find name 'self'.
    return self as unknown as T;
  }
  return localGlobal as unknown as T;
}

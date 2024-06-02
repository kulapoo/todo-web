export async function intoJSON<T extends Response>(promise: Promise<T>) {
  const res = await promise
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return res.json()
}
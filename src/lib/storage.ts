export const storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item) as T
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },
}

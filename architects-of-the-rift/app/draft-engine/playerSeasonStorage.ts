import { normalizePlayerSeasonStore } from "./storageMigration";

export type PlayerGameLog = {
  playerId: string
  teamSlug: string
  role: string
  score: number
  side: "blue" | "red"
  result: "win" | "loss"
  bestOf: number
}

export type PlayerSeasonStore = {
  logs: PlayerGameLog[]
}

const STORAGE_KEY = "rift-player-season-stats"

export function readPlayerSeasonStore(): PlayerSeasonStore {
  if (typeof window === "undefined") {
    return { logs: [] }
  }

  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return { logs: [] }
  }

  try {
    return normalizePlayerSeasonStore(JSON.parse(raw))
  } catch {
    return { logs: [] }
  }
}

export function savePlayerSeasonStore(store: PlayerSeasonStore) {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizePlayerSeasonStore(store)))
}

export function recordGame(log: PlayerGameLog) {
  const store = readPlayerSeasonStore()

  store.logs.push(log)

  savePlayerSeasonStore(store)
}

export function resetPlayerSeasonStore() {
  if (typeof window === "undefined") return

  localStorage.removeItem(STORAGE_KEY)
}
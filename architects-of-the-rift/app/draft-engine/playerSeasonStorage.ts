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

let batchDepth = 0
let pendingLogs: PlayerGameLog[] = []

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

export function beginPlayerSeasonBatch() {
  batchDepth += 1
}

export function flushPlayerSeasonBatch() {
  if (batchDepth === 0) return

  batchDepth -= 1

  if (batchDepth > 0) return
  if (pendingLogs.length === 0) return

  const store = readPlayerSeasonStore()
  store.logs.push(...pendingLogs)
  pendingLogs = []
  savePlayerSeasonStore(store)
}

export function recordGames(logs: PlayerGameLog[]) {
  if (logs.length === 0) return

  if (batchDepth > 0) {
    pendingLogs.push(...logs)
    return
  }

  const store = readPlayerSeasonStore()
  store.logs.push(...logs)
  savePlayerSeasonStore(store)
}

export function recordGame(log: PlayerGameLog) {
  recordGames([log])
}

export function resetPlayerSeasonStore() {
  if (typeof window === "undefined") return

  batchDepth = 0
  pendingLogs = []
  localStorage.removeItem(STORAGE_KEY)
}

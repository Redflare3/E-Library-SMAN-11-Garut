// Penyimpanan token & profil pengguna di localStorage.
// Modul terpisah agar client.js dan stores/auth.js tidak saling import (circular).

const TOKEN_KEY = 'elib_token'
const USER_KEY = 'elib_user'
const LEGACY_KEYS = ['auth_role', 'auth_user']

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage diblokir: sesi hanya hidup di memori */
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* abaikan */
  }
}

export function getToken() {
  return safeGet(TOKEN_KEY)
}

export function setToken(token) {
  safeSet(TOKEN_KEY, token)
}

export function clearToken() {
  safeRemove(TOKEN_KEY)
  safeRemove(USER_KEY)
}

export function getCachedUser() {
  const raw = safeGet(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setCachedUser(user) {
  safeSet(USER_KEY, JSON.stringify(user))
}

// Hapus kunci sesi lama dari versi mock (auth_role / auth_user)
export function clearLegacyKeys() {
  LEGACY_KEYS.forEach(safeRemove)
}

import { request } from './client.js'

// Login tidak boleh memicu handler 401 global: password salah = 400 INVALID_CREDENTIALS
export function login(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
    skipAuthRedirect: true
  })
}

export function me() {
  return request('/auth/me', { skipAuthRedirect: true })
}

export function changePassword(oldPassword, newPassword) {
  return request('/auth/change-password', {
    method: 'POST',
    body: { oldPassword, newPassword }
  })
}

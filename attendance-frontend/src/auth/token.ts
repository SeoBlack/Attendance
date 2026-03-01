export function getRawToken() {
  return localStorage.getItem('token')
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function resetToken() {
  localStorage.removeItem('token')
}

import { pbkdf2Sync } from 'node:crypto'
import { envs } from '~/configs/env.config'

const ITERATIONS = 10
const KEYLEN = 64
const DIGEST = 'sha512'

export function hashPassword(password: string) {
  return pbkdf2Sync(password, envs.PASSWORD_SALT, ITERATIONS, KEYLEN, DIGEST).toString('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  const hashVerify = pbkdf2Sync(password, envs.PASSWORD_SALT, ITERATIONS, KEYLEN, DIGEST).toString('hex')
  return hash === hashVerify
}

export function generatePassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }
  return password
}

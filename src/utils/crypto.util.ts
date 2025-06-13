import { pbkdf2Sync } from 'node:crypto'
import { envs } from '~/configs/env.config'

export function hashPassword(password: string) {
  return pbkdf2Sync(password, envs.PASSWORD_SALT, 10, 64, 'sha512').toString('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  const hashVerify = pbkdf2Sync(password, envs.PASSWORD_SALT, 10, 64, 'sha512').toString('hex')
  return hash === hashVerify
}

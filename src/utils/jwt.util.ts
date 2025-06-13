import jwt, { SignOptions } from 'jsonwebtoken'
import { StringValue } from 'ms'
import { envs } from '~/configs/env.config'

export async function signToken({
  payload,
  privateKey = envs.JWT_SECRET,
  options = { algorithm: 'ES256', expiresIn: envs.ACCESS_TOKEN_EXPIRES_IN as StringValue }
}: {
  payload: string | object
  privateKey?: string
  options?: SignOptions
}) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err || !token) {
        reject(err)
        return
      }
      resolve(token)
    })
  })
}

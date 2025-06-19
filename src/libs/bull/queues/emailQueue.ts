import Queue from 'bull'
import { envs } from '~/configs/env.config'

export const emailQueue = new Queue('email', {
  redis: { host: envs.REDIS_HOST, port: envs.REDIS_PORT },
  defaultJobOptions: {
    attempts: 3, // Thử lại tối đa 3 lần
    backoff: { type: 'exponential', delay: 1000 } // Delay tăng dần
  }
})

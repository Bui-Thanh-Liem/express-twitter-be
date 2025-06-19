import mailServiceInstance from '~/helpers/mail.helper'
import { emailQueue } from '../queues'

emailQueue.process(async (job, done) => {
  try {
    console.log('Worker running...')
    const { toEmail, name, url } = job.data
    await mailServiceInstance.sendVerifyEmail({ toEmail, name, url })
    console.log('Email sent to', toEmail)
    done() // Báo hoàn thành
  } catch (error) {
    console.error(`Failed to send email to ${job.data.toEmail}:`, error)
    done(new Error('Failed to send email')) // Báo lỗi để Bull retry
  }
})

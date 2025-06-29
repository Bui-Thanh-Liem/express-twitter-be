import mailServiceInstance from '~/helpers/mail.helper'
import { emailQueue } from '../queues'

// Worker xử lý gửi email xác thực
emailQueue.process('verify-email', 5, async (job, done) => {
  try {
    const { toEmail, name, url } = job.data
    await mailServiceInstance.sendVerifyEmail({ toEmail, name, url })
    console.log('Sent verify email to', toEmail)
    done()
  } catch (error) {
    console.error(`Verify email failed for ${job.data.toEmail}`, error)
    done(new Error('Verify email failed'))
  }
})

// Worker xử lý gửi email quên mật khẩu
emailQueue.process('forgot-password', 5, async (job, done) => {
  try {
    const { toEmail, name, url } = job.data
    await mailServiceInstance.sendForgotPasswordEmail({ toEmail, name, url })
    console.log('Sent forgot password email to', toEmail)
    done()
  } catch (error) {
    console.error(`Forgot password email failed for ${job.data.toEmail}`, error)
    done(new Error('Forgot password email failed'))
  }
})

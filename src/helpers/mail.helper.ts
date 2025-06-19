import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import { envs } from '~/configs/env.config'
import { BadRequestError } from '~/shared/classes/error.class'
import { ISendVerifyEmail } from '~/shared/interfaces/common/mail.interface'

class MailService {
  private transporter
  private from = envs.MAIL_SERVICE_ROOT || ''

  constructor() {
    // Bước 1: Transporter với Gmail (hoặc SMTP khác)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envs.MAIL_SERVICE_USER,
        pass: envs.MAIL_SERVICE_PASS
      }
    })

    // Bước 2: Cài handlebars

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.handlebars',
          partialsDir: path.resolve('./src/templates'),
          defaultLayout: false
        },
        viewPath: path.resolve('./src/templates'),
        extName: '.handlebars'
      })
    )
  }

  /**
   * Gửi email xác minh tài khoản
   * @param toEmail địa chỉ email người nhận
   * @param userName tên người nhận
   * @param verifyCode mã xác minh
   */
  async sendVerifyEmail({ toEmail, name, verifyCode }: ISendVerifyEmail) {
    const _mailOptions = {
      from: this.from,
      to: toEmail,
      subject: 'Verify your email',
      template: 'verifyEmail',
      context: {
        name,
        code: verifyCode
      }
    }

    //
    try {
      console.log('✅ Đang gửi email xác minh:', toEmail)
      const info = await this.transporter.sendMail(_mailOptions)
      console.log('✅ Đã gửi email xác minh:', info.response)
    } catch (error) {
      console.error('❌ Lỗi gửi email xác minh:', error)
      throw new BadRequestError(error as string)
    }
  }
}

const mailServiceInstance = new MailService()
export default mailServiceInstance

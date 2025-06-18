import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import { envs } from '~/configs/env.config'
import { BadRequestError } from '~/shared/classes/error.class'

export class MailService {
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
          partialsDir: path.resolve('./templates'),
          defaultLayout: false
        },
        viewPath: path.resolve('./templates'),
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
  async sendVerifyEmail(toEmail: string, userName: string, verifyCode: string) {
    const _mailOptions = {
      from: this.from,
      to: toEmail,
      subject: 'Verify your email',
      template: 'verifyEmail',
      context: {
        name: userName,
        code: verifyCode
      }
    }

    //
    try {
      const info = await this.transporter.sendMail(_mailOptions)
      console.log('✅ Đã gửi email xác minh:', info.response)
    } catch (error) {
      console.error('❌ Lỗi gửi email xác minh:', error)
      throw new BadRequestError(error as string)
    }
  }
}

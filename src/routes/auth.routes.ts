import { Router } from 'express'
import UsersControllers from '~/controllers/Users.controller'
import { LoginUserDtoSchema, RegisterUserDtoSchema } from '~/dtos/requests/auth.dto'
import {
  ChangePasswordDtoSchema,
  ForgotPasswordDtoSchema,
  ResetPasswordDtoSchema,
  UpdateMeDtoSchema
} from '~/dtos/requests/user.dto'
import { requestBodyValidate } from '~/middlewares/requestBodyValidate.middleware'
import { verifyAccessToken } from '~/middlewares/verifyAccessToken.middleware'
import { verifyRefreshToken } from '~/middlewares/verifyRefreshToken.middleware'
import { verifyTokenForgotPassword } from '~/middlewares/verifyTokenForgotPassword.middleware'
import { verifyUserActiveForChangePassword } from '~/middlewares/verifyUserActiveForChangePassword.middleware'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const authRoute = Router()

authRoute.post('/register', requestBodyValidate(RegisterUserDtoSchema), wrapAsyncHandler(UsersControllers.register))

authRoute.post('/login', requestBodyValidate(LoginUserDtoSchema), UsersControllers.login)

authRoute.get('/google-login', UsersControllers.googleLogin)

authRoute.post('/logout', verifyAccessToken, verifyRefreshToken, wrapAsyncHandler(UsersControllers.logout))

authRoute.post('/refresh-token', verifyRefreshToken, wrapAsyncHandler(UsersControllers.refreshToken))

authRoute.post(
  '/change-password',
  verifyAccessToken,
  requestBodyValidate(ChangePasswordDtoSchema),
  verifyUserActiveForChangePassword,
  wrapAsyncHandler(UsersControllers.changePassword)
)

authRoute.post(
  '/forgot-password',
  requestBodyValidate(ForgotPasswordDtoSchema),
  wrapAsyncHandler(UsersControllers.forgotPassword)
)

authRoute.post(
  '/reset-password',
  requestBodyValidate(ResetPasswordDtoSchema),
  verifyTokenForgotPassword,
  wrapAsyncHandler(UsersControllers.resetPassword)
)

authRoute
  .route('/me')
  .get(verifyAccessToken, verifyRefreshToken, wrapAsyncHandler(UsersControllers.getMe))
  .patch(verifyAccessToken, requestBodyValidate(UpdateMeDtoSchema), wrapAsyncHandler(UsersControllers.updateMe))

export default authRoute

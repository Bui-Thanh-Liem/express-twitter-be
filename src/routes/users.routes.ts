import { Router } from 'express'
import UsersControllers from '~/controllers/Users.controller'
import {
  ChangePasswordDtoSchema,
  ForgotPasswordDtoSchema,
  LoginUserDtoSchema,
  RegisterUserDtoSchema,
  ResetPasswordDtoSchema,
  toggleFollowDtoSchema,
  UpdateMeDtoSchema,
  verifyEmailDtoSchema
} from '~/dtos/requests/User.dto'
import { requestBodyValidate } from '~/middlewares/requestBodyValidate.middleware'
import { requestParamsValidate } from '~/middlewares/requestParamsValidate.middleware'
import { verifyAccessToken } from '~/middlewares/verifyAccessToken.middleware'
import { verifyRefreshToken } from '~/middlewares/verifyRefreshToken.middleware'
import { verifyTokenForgotPassword } from '~/middlewares/verifyTokenForgotPassword.middleware'
import { verifyTokenVerifyEmail } from '~/middlewares/verifyTokenVerifyEmail.middleware'
import { verifyUserActiveForChangePassword } from '~/middlewares/verifyUserActiveForChangePassword.middleware'
import { verifyUserActiveForFollow } from '~/middlewares/verifyUserActiveForFollow.middleware'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const usersRoute = Router()

usersRoute.post('/register', requestBodyValidate(RegisterUserDtoSchema), wrapAsyncHandler(UsersControllers.register))

usersRoute.post('/login', requestBodyValidate(LoginUserDtoSchema), UsersControllers.login)

usersRoute.get('/google-login', UsersControllers.googleLogin)

usersRoute.post('/logout', verifyAccessToken, verifyRefreshToken, wrapAsyncHandler(UsersControllers.logout))

usersRoute.post('/refresh-token', verifyRefreshToken, wrapAsyncHandler(UsersControllers.refreshToken))

usersRoute.post(
  '/change-password',
  verifyAccessToken,
  requestBodyValidate(ChangePasswordDtoSchema),
  verifyUserActiveForChangePassword,
  wrapAsyncHandler(UsersControllers.changePassword)
)

usersRoute.post(
  '/forgot-password',
  requestBodyValidate(ForgotPasswordDtoSchema),
  wrapAsyncHandler(UsersControllers.forgotPassword)
)

usersRoute.post(
  '/reset-password',
  requestBodyValidate(ResetPasswordDtoSchema),
  verifyTokenForgotPassword,
  wrapAsyncHandler(UsersControllers.resetPassword)
)

usersRoute.post(
  '/verify-email',
  verifyAccessToken,
  requestBodyValidate(verifyEmailDtoSchema),
  verifyTokenVerifyEmail,
  wrapAsyncHandler(UsersControllers.verifyEmail)
)

usersRoute.post('/resend-verify-email', verifyAccessToken, wrapAsyncHandler(UsersControllers.resendVerifyEmail))

usersRoute
  .route('/me')
  .get(verifyAccessToken, verifyRefreshToken, wrapAsyncHandler(UsersControllers.getMe))
  .patch(verifyAccessToken, requestBodyValidate(UpdateMeDtoSchema), wrapAsyncHandler(UsersControllers.updateMe))

usersRoute.post(
  '/toggle-follow/:followed_user_id',
  verifyAccessToken,
  requestParamsValidate(toggleFollowDtoSchema),
  verifyUserActiveForFollow,
  wrapAsyncHandler(UsersControllers.toggleFollow)
)

usersRoute.get('/username/:username', verifyAccessToken, wrapAsyncHandler(UsersControllers.getIdByUsername))

export default usersRoute

import { Router } from 'express'
import UsersControllers from '~/controllers/Users.controller'
import { toggleFollowDtoSchema, verifyEmailDtoSchema } from '~/dtos/requests/user.dto'
import { requestBodyValidate } from '~/middlewares/requestBodyValidate.middleware'
import { requestParamsValidate } from '~/middlewares/requestParamsValidate.middleware'
import { verifyAccessToken } from '~/middlewares/verifyAccessToken.middleware'
import { verifyTokenVerifyEmail } from '~/middlewares/verifyTokenVerifyEmail.middleware'
import { verifyUserActive } from '~/middlewares/verifyUserActive.middleware'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const usersRoute = Router()

usersRoute.post(
  '/verify-email',
  verifyAccessToken,
  requestBodyValidate(verifyEmailDtoSchema),
  verifyTokenVerifyEmail,
  wrapAsyncHandler(UsersControllers.verifyEmail)
)

usersRoute.post('/resend-verify-email', verifyAccessToken, wrapAsyncHandler(UsersControllers.resendVerifyEmail))

usersRoute.post(
  '/toggle-follow/:followed_user_id',
  verifyAccessToken,
  verifyUserActive,
  requestParamsValidate(toggleFollowDtoSchema),
  wrapAsyncHandler(UsersControllers.toggleFollow)
)

usersRoute.get('/username/:username', verifyAccessToken, wrapAsyncHandler(UsersControllers.getIdByUsername))

export default usersRoute

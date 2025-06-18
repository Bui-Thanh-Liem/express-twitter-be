import { Router } from 'express'
import UsersControllers from '~/controllers/users.controllers'
import { LoginUserDtoSchema, RegisterUserDtoSchema } from '~/dtos/requests/User.dto'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'
import { requestValidate } from '~/middlewares/requestValidate.middleware'
import { verifyAccessToken } from '~/middlewares/verifyAccessToken.middleware'
import { verifyRefreshToken } from '~/middlewares/verifyRefreshToken.middleware'

const usersRoute = Router()

usersRoute.post('/register', requestValidate(RegisterUserDtoSchema), wrapAsyncHandler(UsersControllers.register))
usersRoute.post('/login', requestValidate(LoginUserDtoSchema), UsersControllers.login)
usersRoute.post('/logout', verifyAccessToken, verifyRefreshToken, wrapAsyncHandler(UsersControllers.logout))
usersRoute.get('/me', verifyAccessToken, verifyRefreshToken, wrapAsyncHandler(UsersControllers.getMe))

export default usersRoute

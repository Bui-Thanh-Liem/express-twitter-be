import { Router } from 'express'
import UsersControllers from '~/controllers/users.controllers'
import { LoginUserDtoSchema, RegisterUserDtoSchema } from '~/dtos/User.dto'
import { requestValidate } from '~/middlewares/requestValidate.middleware'

const usersRoute = Router()

usersRoute.post('/register', requestValidate(RegisterUserDtoSchema), UsersControllers.register)
usersRoute.post('/login', requestValidate(LoginUserDtoSchema), UsersControllers.login)

export default usersRoute

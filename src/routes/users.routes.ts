import { Router } from 'express'
import UsersControllers from '~/controllers/users.controllers'
import { RegisterUserDtoSchema } from '~/dtos/User.dto'
import { requestValidate } from '~/middlewares/requestValidate.middleware'

const usersRoute = Router()

usersRoute.post('/register', requestValidate(RegisterUserDtoSchema), UsersControllers.register)

export default usersRoute

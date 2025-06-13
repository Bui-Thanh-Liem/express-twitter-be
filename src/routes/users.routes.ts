import { Router } from 'express'
import UsersController from '~/controllers/Users.controllers'
import { RegisterUserDtoSchema } from '~/dtos/User.dto'
import { requestValidate } from '~/middlewares/requestValidate.middleware'

const usersRoute = Router()

usersRoute.post('/register', requestValidate(RegisterUserDtoSchema), UsersController.register)

export default usersRoute

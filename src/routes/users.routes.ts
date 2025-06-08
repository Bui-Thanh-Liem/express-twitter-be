import { Router } from 'express'
import { usersController } from '~/controllers/users.controllers'

const usersRoute = Router()

usersRoute.get('/', usersController)

export default usersRoute

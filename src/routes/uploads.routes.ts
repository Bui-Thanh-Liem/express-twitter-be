import { Router } from 'express'
import UploadsControllers from '~/controllers/uploads.controllers'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const uploadsRoute = Router()

uploadsRoute.post('/medias', wrapAsyncHandler(UploadsControllers.uploadMedias))

export default uploadsRoute

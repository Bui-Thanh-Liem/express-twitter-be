import { Router } from 'express'
import UploadsControllers from '~/controllers/Uploads.controllers'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const uploadsRoute = Router()

uploadsRoute.post('/medias', wrapAsyncHandler(UploadsControllers.uploadSingleImage))

export default uploadsRoute

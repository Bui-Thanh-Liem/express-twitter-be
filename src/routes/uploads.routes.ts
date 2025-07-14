import { Router } from 'express'
import UploadsControllers from '~/controllers/Uploads.controller'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const uploadsRoute = Router()

uploadsRoute.post('/images', wrapAsyncHandler(UploadsControllers.uploadImages))
uploadsRoute.post('/videos', wrapAsyncHandler(UploadsControllers.uploadVideos))

export default uploadsRoute

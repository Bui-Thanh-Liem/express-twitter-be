import { NextFunction, Request, Response } from 'express'
import UploadsService from '~/services/Uploads.service'
import { OkResponse } from '~/shared/classes/response.class'

class UploadsController {
  async uploadSingleImage(req: Request, res: Response, next: NextFunction) {
    const result = await UploadsService.uploadSingleImage(req)
    res.status(200).json(new OkResponse('Success', result))
  }
}

export default new UploadsController()

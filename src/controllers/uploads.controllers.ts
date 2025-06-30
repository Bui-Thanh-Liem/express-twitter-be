import { NextFunction, Request, Response } from 'express'
// const { default: formidable } = await import('formidable')
import formidable from 'formidable'
import path from 'path'
import { BadRequestError } from '~/shared/classes/error.class'
import { OkResponse } from '~/shared/classes/response.class'

class UploadsControllers {
  async uploadMedias(req: Request, res: Response, next: NextFunction) {
    const form = formidable({
      uploadDir: path.resolve('uploads'),
      maxFiles: 1,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        throw new BadRequestError(err)
      }

      if (!files || Object.keys(files).length === 0) {
        return next(new BadRequestError('No file uploaded'))
      }

      res.json(new OkResponse('Success', { fields, files }))
    })
  }
}

export default new UploadsControllers()

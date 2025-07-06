import { Request } from 'express'
import { uploadSingleImage } from '~/utils/file.util'

class UploadsService {
  async uploadSingleImage(req: Request) {
    const file = await uploadSingleImage(req)
    return file
  }
}

export default new UploadsService()

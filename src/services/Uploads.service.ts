import { Request } from 'express'
import { uploadImages, uploadVideos } from '~/utils/upload.util'

class UploadsService {
  async uploadImages(req: Request) {
    const files = await uploadImages(req)
    return files
  }

  async uploadVideos(req: Request) {
    const videos = await uploadVideos(req)
    return videos
  }
}

export default new UploadsService()

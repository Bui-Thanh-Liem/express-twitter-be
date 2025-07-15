import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import mime from 'mime'
import path from 'path'
import { BadRequestError } from '~/shared/classes/error.class'
import { UPLOAD_VIDEO_FOLDER_PATH } from '~/shared/consts/path.conts'

class StreamVideoController {
  async streamVideo(req: Request, res: Response, next: NextFunction) {
    const range = req.headers.range
    console.log('range::', range)

    if (!range) {
      throw new BadRequestError('Required range headers')
    }

    const { filename } = req.params
    const videoPath = path.resolve(UPLOAD_VIDEO_FOLDER_PATH, filename)

    const videoSize = fs.statSync(videoPath).size
    const chunkSize = 10 ** 6 // 1mb - byte
    console.log('chunkSize:::', chunkSize)

    const start = Number(range?.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, videoSize - 1) // đảm bảo end không bao giờ lớn hơn dung lượng video (-1)

    const contentLength = end - start + 1
    const contentType = mime.getType(videoPath) || 'video/*'
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-type': contentType
    }

    console.log('start:::', start)
    console.log('end:::', end)
    console.log('contentLength:::', contentLength)

    res.writeHead(206, headers)
    const videoStreams = fs.createReadStream(videoPath, { start, end })
    videoStreams.pipe(res)
  }
}

export default new StreamVideoController()

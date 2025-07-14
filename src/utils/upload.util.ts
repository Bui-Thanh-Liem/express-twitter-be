import { Request } from 'express'
// const { default: formidable } = await import('formidable')
import formidable, { File } from 'formidable'
import fs from 'fs'
import { envs } from '~/configs/env.config'
import { BadRequestError } from '~/shared/classes/error.class'
import { UPLOAD_IMAGE_FOLDER_PATH, UPLOAD_VIDEO_FOLDER_PATH } from '~/shared/consts/path.conts'
import { compressionFile, compressionVideo } from './compression.util'

export function uploadImages(req: Request): Promise<string[]> {
  //
  const fileSize = 3 * 1024 * 1024 // 3mb
  const maxFiles = 10

  if (!fs.existsSync(UPLOAD_IMAGE_FOLDER_PATH)) {
    fs.mkdirSync(UPLOAD_IMAGE_FOLDER_PATH, { recursive: true })
  }

  //
  const form = formidable({
    multiples: true,
    maxFiles: maxFiles,
    keepExtensions: true,
    uploadDir: UPLOAD_IMAGE_FOLDER_PATH,
    maxFileSize: fileSize,
    maxTotalFileSize: maxFiles * fileSize,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'images' && Boolean(mimetype && mimetype?.includes('image/'))

      if (!valid) {
        form.emit('error' as any, new BadRequestError('File type or filename is not valid') as any)
      }

      return valid
    }
  })

  //
  return new Promise((res, rej) => {
    form.parse(req, (err, fields, files) => {
      //
      if (err) {
        return rej(new BadRequestError(err?.message || 'Images upload error'))
      }

      const imageUploaded = files['images'] as File[]

      ;(async () => {
        try {
          const compressedFiles = await Promise.all(imageUploaded.map((img) => compressionFile(img)))
          const imgMap = compressedFiles.map((img) => `${envs.SERVER_DOMAIN}/${img}`)
          res(imgMap)
        } catch (error) {
          rej(error)
        }
      })()
    })
  })
}

export function uploadVideos(req: Request): Promise<string[]> {
  //
  const fileSize = 50 * 1024 * 1024 // 50mb
  const maxFiles = 2

  //
  if (!fs.existsSync(UPLOAD_VIDEO_FOLDER_PATH)) {
    fs.mkdirSync(UPLOAD_VIDEO_FOLDER_PATH, { recursive: true })
  }

  //
  const form = formidable({
    multiples: true,
    maxFiles: maxFiles,
    keepExtensions: true,
    uploadDir: UPLOAD_VIDEO_FOLDER_PATH,
    maxFileSize: fileSize,
    maxTotalFileSize: maxFiles * fileSize,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'videos' && Boolean(mimetype && mimetype?.includes('video/'))

      if (!valid) {
        form.emit('error' as any, new BadRequestError('File type or filename is not valid') as any)
      }

      return valid
    }
  })

  //
  return new Promise((res, rej) => {
    form.parse(req, (err, fields, files) => {
      //
      if (err) {
        return rej(new BadRequestError(err?.message || 'Videos upload error'))
      }

      //
      const videoUploaded = files['videos'] as File[]

      ;(async () => {
        try {
          const videoMap = Promise.all(
            videoUploaded.map(async (video) => {
              console.log('video::', video)
              await compressionVideo(video.filepath)
              return `${envs.SERVER_DOMAIN}/${video.newFilename}`
            })
          )

          res(videoMap)
        } catch (error) {
          rej(error)
        }
      })()
    })
  })
}

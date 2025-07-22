import { Request } from 'express'
// const { default: formidable } = await import('formidable')
import formidable, { File, Part } from 'formidable'
import fs from 'fs'
import { InsertOneResult, ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'
import path from 'path'
import { envs } from '~/configs/env.config'
import { CONSTANT_JOB } from '~/constants'
import { compressionQueue } from '~/libs/bull/queues'
import { VideoSchema } from '~/models/schemas/Video.schema'
import VideosService from '~/services/Video.service'
import { BadRequestError } from '~/shared/classes/error.class'
import { UPLOAD_IMAGE_FOLDER_PATH, UPLOAD_VIDEO_FOLDER_PATH } from '~/shared/consts/path.conts'
import { compressionFile } from './compression.util'

// class Queue {
//   items: string[]
//   encoding: boolean
//   constructor() {
//     this.items = []
//     this.encoding = false
//   }

//   enqueue(item: string) {
//     this.items.push(item)
//     this.processEncode()
//   }

//   async processEncode() {
//     if (this.encoding) return
//     if (this.items.length > 0) {
//       this.encoding = true
//       const filepath = this.items[0]
//       try {
//         await compressionVideo(filepath)
//         this.items.shift()
//         console.log(`Encode video ${filepath} success`)
//       } catch (error) {
//         console.log(`Encode video ${filepath} error`)
//         console.log('error:::', error)
//       }
//       this.encoding = false
//       this.processEncode()
//     } else {
//       console.log('Encode video queue is empty')
//     }
//   }
// }

// const queue = new Queue()

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
    },
    filename(name: string, ext: string, part: Part) {
      // Mục đích tạo cho mỗi video 1 folder để convert HLS
      const filename = nanoid()

      //
      const folderPath = path.join(UPLOAD_VIDEO_FOLDER_PATH, filename)

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
      }

      return `${filename}/${filename}${ext}`
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

              //
              const user_id = new ObjectId(req.decoded_authorization?.user_id)
              const name = video.newFilename.split('/')[0]
              const newVideo = await VideosService.create({
                name,
                user_id,
                size: video.size
              })

              // Sử dụng Queue phía trên đơn giản hơn, nhưng chung thread (lag app), không tận dụng chạy song song, không retry
              compressionQueue.add(CONSTANT_JOB.COMPRESSION_HLS, {
                _id: newVideo.insertedId,
                path: video.filepath
              })

              //
              return name
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

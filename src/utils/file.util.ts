import { Request } from 'express'
// const { default: formidable } = await import('formidable')
import formidable, { File } from 'formidable'
import fs, { unlinkSync } from 'fs'
import path, { join } from 'path'
import sharp from 'sharp'
import { BadRequestError } from '~/shared/classes/error.class'

const uploadFolderPath = path.resolve('uploads')
export function uploadSingleImage(req: Request): Promise<string> {
  //

  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true
    })
  }

  //
  const form = formidable({
    multiples: false,
    maxFiles: 1,
    keepExtensions: true,
    uploadDir: uploadFolderPath,
    maxFileSize: 10 * (1024 * 1024), // 10mb
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype && mimetype?.includes('image/'))

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
        return rej(new BadRequestError(err?.message || 'File upload error'))
      }

      //
      if (!files || Object.keys(files).length === 0) {
        return rej(new BadRequestError('No file uploaded'))
      }

      // Formiable luôn luôn xử lý thành mảng
      if (!files['image'] || !Array.isArray(files['image']) || files['image']?.length === 0) {
        return rej(new BadRequestError('No valid file uploaded'))
      }
      const file = files['image'][0] as File

      //
      res(compressionFile(file))
    })
  })
}

export async function compressionFile(file: File): Promise<string> {
  const filename = file.newFilename.split('.').shift()
  const newFilename = `${filename}.jpeg`

  return new Promise((res, rej) => {
    sharp(file.filepath)
      .jpeg({ quality: 80 })
      .toFile(join(uploadFolderPath, newFilename))
      .then(() => {
        unlinkSync(file.filepath)
        res(newFilename)
      })
      .catch((err) => {
        rej(err)
      })
  })
}

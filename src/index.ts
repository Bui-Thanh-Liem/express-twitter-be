import express from 'express'
import morgan from 'morgan'
import database from '~/configs/database.config'
import { envs } from './configs/env.config'
import StreamVideoController from './controllers/StreamVideo.controller'
import { errorHandler } from './middlewares/errorhandler.middleware'
import { loggerMiddleware } from './middlewares/logger.middleware'
import uploadsRoute from './routes/uploads.routes'
import usersRoute from './routes/users.routes'
import { UPLOAD_IMAGE_FOLDER_PATH, UPLOAD_VIDEO_FOLDER_PATH } from './shared/consts/path.conts'

const app = express()
const port = envs.SERVER_PORT
const host = envs.SERVER_HOST

app.use(morgan('dev'))
app.use(loggerMiddleware)
app.use(express.json())

//
app.use('/users', usersRoute)
app.use('/uploads', uploadsRoute)
app.use('/video/:filename', StreamVideoController.streamVideo)
app.use(express.static(UPLOAD_IMAGE_FOLDER_PATH))
app.use(express.static(UPLOAD_VIDEO_FOLDER_PATH))

//
app.use(errorHandler)

//
async function bootstrap() {
  try {
    await database.connect()
    console.log('Database connected!')

    app.listen(port, host, () => {
      console.log(`Example app listening on ${host}:${port}`)
    })
  } catch (err) {
    await database.disconnect()
    console.error('Failed to connect database:', err)
    process.exit(1) // dừng app nếu không connect được
  }
}

bootstrap()

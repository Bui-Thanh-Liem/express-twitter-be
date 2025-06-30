import express from 'express'
import morgan from 'morgan'
import database from '~/configs/database.config'
import { envs } from './configs/env.config'
import { errorHandler } from './middlewares/errorhandler.middleware'
import { loggerMiddleware } from './middlewares/logger.middleware'
import usersRoute from './routes/users.routes'
import uploadsRoute from './routes/uploads.routes'

const app = express()
const port = envs.SERVER_PORT
const host = envs.SERVER_HOST

app.use(morgan('dev'))
app.use(loggerMiddleware)
app.use(express.json())

//
app.use('/users', usersRoute)
app.use('/uploads', uploadsRoute)

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

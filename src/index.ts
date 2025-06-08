import express from 'express'
import morgan from 'morgan'
import { loggerMiddleware } from './middlewares/logger.middleware'
import tweetsRoute from './routes/tweets.routes'
import usersRoute from './routes/users.routes'

const app = express()
const port = 3000

app.use(morgan('dev'))
app.use(loggerMiddleware)
app.use(express.json())

//
app.use('/users', usersRoute)
app.use('/tweets', tweetsRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

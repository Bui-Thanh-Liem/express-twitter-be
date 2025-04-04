import express from 'express'

const app = express()
const port = 3000
const router = express.Router()

app.use((req, res, next) => {
  console.log(new Date())
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/tweets', (req, res) => {
  res.json({ message: 'data tweets' })
})

app.use('/api', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

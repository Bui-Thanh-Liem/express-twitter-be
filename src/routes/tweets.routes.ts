import { Request, Response, Router } from 'express'

const tweetsRoute = Router()

tweetsRoute.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'tweets route' })
})

export default tweetsRoute

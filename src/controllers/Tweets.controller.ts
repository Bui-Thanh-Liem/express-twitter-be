import { Request, Response } from 'express'
import TweetsService from '~/services/Tweets.service'
import { CreatedResponse } from '~/shared/classes/response.class'
import { IJwtPayload } from '~/shared/interfaces/common/jwt.interface'

class TweetsController {
  async create(req: Request, res: Response) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await TweetsService.create(user_id, req.body)
    res.status(201).json(new CreatedResponse('Create tweet Success', result))
  }
}

export default new TweetsController()

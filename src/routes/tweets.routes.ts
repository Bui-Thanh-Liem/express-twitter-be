import { Router } from 'express'
import TweetsController from '~/controllers/Tweets.controller'
import { CreateTweetDtoSchema } from '~/dtos/requests/tweet.dto'
import { requestBodyValidate } from '~/middlewares/requestBodyValidate.middleware'
import { verifyAccessToken } from '~/middlewares/verifyAccessToken.middleware'
import { verifyUserActive } from '~/middlewares/verifyUserActive.middleware'
import { wrapAsyncHandler } from '~/utils/wrapAsyncHandler.util'

const tweetsRoute = Router()

tweetsRoute.post(
  '/',
  verifyAccessToken,
  verifyUserActive,
  requestBodyValidate(CreateTweetDtoSchema),
  wrapAsyncHandler(TweetsController.create)
)

export default tweetsRoute

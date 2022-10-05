import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { getTodosForUser } from '../../helpers/todos';

const logger = createLogger('Todo')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event);

     // TODO: Get all TODO items for a current user
     const todos = await getTodosForUser(userId)
    logger.info("processing event get todos", event)
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      todos
    })
  }
  })

handler.use(
  cors({
    credentials: true
  })
)

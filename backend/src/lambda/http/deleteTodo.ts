import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../helpers/todos'
const logger = createLogger('Todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.warn("Proccessing delete event on todo", event )
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);

  // TODO: Remove a TODO item by id
await deleteTodo(userId, todoId)
  return {
    statusCode: 200,
    body: " "
  }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

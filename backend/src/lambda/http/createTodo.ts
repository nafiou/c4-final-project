import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../helpers/todos'
const logger = createLogger('Todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  logger.info('auth user id ', userId)
  logger.info('Processing event: ', event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
  const todoItem = await createTodo(newTodo, userId)
  return {
    statusCode: 201,
    body: JSON.stringify({item: todoItem})
  }
})

handler.use(
  cors({
    credentials: true
  })
)

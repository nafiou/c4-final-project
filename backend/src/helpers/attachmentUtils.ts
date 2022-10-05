import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('createTodo')

// TODO: Implement the fileStogare logic

export class AttachmentUtils {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3 = new XAWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
    ) {
    }
    async  generateUploadUrl(userId: string, todoId: string): Promise<String> {
        const url = this.getUploadUrl(todoId, this.bucketName)
    
        const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + todoId
    
        const options = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: "set attachmentUrl = :r",
            ExpressionAttributeValues: {
                ":r": attachmentUrl
            },
            ReturnValues: "UPDATED_NEW"
        };
    
        await this.docClient.update(options).promise()
        logger.info("Presigned url generated successfully ", url)
        return url;
    }

    getUploadUrl(todoId: string, bucketName: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: parseInt(urlExpiration)
        })
    }
}
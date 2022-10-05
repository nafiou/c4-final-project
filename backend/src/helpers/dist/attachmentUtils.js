"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AttachmentUtils = void 0;
var AWS = require("aws-sdk");
var logger_1 = require("../utils/logger");
var AWSXRay = require('aws-xray-sdk');
var XAWS = AWSXRay.captureAWS(AWS);
var urlExpiration = process.env.SIGNED_URL_EXPIRATION;
var logger = logger_1.createLogger('createTodo');
var s3 = new XAWS.S3({
    signatureVersion: 'v4'
});
// TODO: Implement the fileStogare logic
var AttachmentUtils = /** @class */ (function () {
    function AttachmentUtils(docClient, todosTable, bucketName) {
        if (docClient === void 0) { docClient = createDynamoDBClient(); }
        if (todosTable === void 0) { todosTable = process.env.TODOS_TABLE; }
        if (bucketName === void 0) { bucketName = process.env.ATTACHMENT_S3_BUCKET; }
        this.docClient = docClient;
        this.todosTable = todosTable;
        this.bucketName = bucketName;
    }
    AttachmentUtils.prototype.generateUploadUrl = function (userId, todoId) {
        return __awaiter(this, void 0, Promise, function () {
            var url, attachmentUrl, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = getUploadUrl(todoId, this.bucketName);
                        attachmentUrl = 'https://' + this.bucketName + '.s3.amazonaws.com/' + todoId;
                        options = {
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
                        return [4 /*yield*/, this.docClient.update(options).promise()];
                    case 1:
                        _a.sent();
                        logger.info("Presigned url generated successfully ", url);
                        return [2 /*return*/, url];
                }
            });
        });
    };
    return AttachmentUtils;
}());
exports.AttachmentUtils = AttachmentUtils;
function getUploadUrl(todoId, bucketName) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: parseInt(urlExpiration)
    });
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance');
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
    }
    return new XAWS.DynamoDB.DocumentClient();
}

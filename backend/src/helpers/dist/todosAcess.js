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
exports.TodosAccess = void 0;
var AWS = require("aws-sdk");
// import * as AWSXRay from 'aws-xray-sdk'
var AWSXRay = require('aws-xray-sdk');
var logger_1 = require("../utils/logger");
var XAWS = AWSXRay.captureAWS(AWS);
var logger = logger_1.createLogger('TodosAccess');
// TODO: Implement the dataLayer logic
var TodosAccess = /** @class */ (function () {
    function TodosAccess(docClient, todosTable) {
        if (docClient === void 0) { docClient = createDynamoDBClient(); }
        if (todosTable === void 0) { todosTable = process.env.TODOS_TABLE; }
        this.docClient = docClient;
        this.todosTable = todosTable;
    }
    TodosAccess.prototype.getTodos = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var result, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.docClient.query({
                            TableName: this.todosTable,
                            KeyConditionExpression: 'userId = :userId',
                            ExpressionAttributeValues: {
                                ':userId': userId
                            }
                        }).promise()];
                    case 1:
                        result = _a.sent();
                        logger.info("Todo's retrieved successfully");
                        items = result.Items;
                        return [2 /*return*/, items];
                }
            });
        });
    };
    TodosAccess.prototype.createTodo = function (todoItem) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.docClient.put({
                            TableName: this.todosTable,
                            Item: todoItem
                        }).promise()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, todoItem];
                }
            });
        });
    };
    TodosAccess.prototype.updateTodo = function (userId, todoId, todoUpdate) {
        return __awaiter(this, void 0, Promise, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.todosTable,
                            Key: {
                                userId: userId,
                                todoId: todoId
                            },
                            UpdateExpression: "set #n = :r, dueDate=:p, done=:a",
                            ExpressionAttributeValues: {
                                ":r": todoUpdate.name,
                                ":p": todoUpdate.dueDate,
                                ":a": todoUpdate.done
                            },
                            ExpressionAttributeNames: {
                                "#n": "name"
                            },
                            ReturnValues: "UPDATED_NEW"
                        };
                        return [4 /*yield*/, this.docClient.update(params).promise()];
                    case 1:
                        _a.sent();
                        logger.info("Update was successful");
                        return [2 /*return*/, todoUpdate];
                }
            });
        });
    };
    TodosAccess.prototype.deleteTodo = function (userId, todoId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.docClient["delete"]({
                            TableName: this.todosTable,
                            Key: {
                                userId: userId,
                                todoId: todoId
                            }
                        }).promise()];
                    case 1:
                        _a.sent();
                        logger.info("delete successfull");
                        return [2 /*return*/, ''];
                }
            });
        });
    };
    return TodosAccess;
}());
exports.TodosAccess = TodosAccess;
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

/**
 * @constant uuid - The variable that constructs uuid column
 */
const uuid = require('uuid');
/**
 * @constant AWS - The variable that access AWS features
 */
const { AWS } = require('./awsConfigs');

/**
 * @constant dynamoDb - The variable that access DynamoDB's features
 */
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = {
    uuid,
    dynamoDb
}

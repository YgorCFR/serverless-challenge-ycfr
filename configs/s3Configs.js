/**
 * @constant AWS The variable that access AWS sdk features
 * @constant config The variable that access the config file
 */
const { AWS, config } = require('./awsConfigs');

/**
 * @constant s3 The variable that access the s3 features
 */
const s3 = new AWS.S3();
/**
 * @constant bucketName The variable that access the bucketName
 */
const bucketName = config.aws.bucketName;

module.exports = {
    s3,
    bucketName
};
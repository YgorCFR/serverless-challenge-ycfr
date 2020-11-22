/**
 * @constant AWS The variable that access AWS sdk features
 */
const AWS = require('aws-sdk');
/**
 * @constant config The variable that access the config file
 */
const config = require('./generalConfigs');

AWS.config.setPromisesDependency();
AWS.config.update({
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretKey
});


module.exports = {
    AWS,
    config
}
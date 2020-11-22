/**
 * @constant dynamoDb - The variable that access dynamoDB's features
 * @constant uuid - The variable that builds the id column from dynamoDB with uuid format
 */
const { dynamoDb, uuid } = require('./configs/dynamoDbConfigs');

/**
 * @constant s3 - The variable that access s3 features
 * @constant bucketName - The variable that stores the name of the used Bucket
 */
const { s3, bucketName } = require('./configs/s3Configs');

/**
 * @constant size - The variable that imports the s3-image-size to retrieve the height and width of an image 
 */
const size = require('s3-image-size');

/**
 * @constant bluebird - The variable that imports the bluedired features
 */
 const bluebird = require('bluebird');

 /**
 * @constant _ - The variable that allows the use of the lodash features
 */
const _ = require('lodash'); 

/**
 * Promisify all s3-image-size size function
 */
bluebird.promisifyAll(size);

/**
 * 
 * @param {TableName, s3objectkey} params 
 * @description Function that receives the TableName and the key of image and retrieves its metadata informations
 */
let getMetadata = async (params) => {
    const data =  await dynamoDb.get(params).promise();
    return data;
}

/**
 * 
 * @param {TableName, ProjectionExpression, ExpressionAttributeNames} params 
 * @param {minByParam, maxByParam, distinctParam, countByParam} queryParams
 * @description Function that receives the arguments params and queryParams and retrieves the existed image types, 
 * image with minimum size, image with maximum size and quantity of images by type 
 */
let infoImages = async (params, queryParams) => {
    const data = await dynamoDb.scan(params).promise()
        .then(data => {
            return data;
        })
        .catch(err => new Error(err));

    return new Promise((resolve, reject) => {
        let results = {
            existedTypes: [...new Set(data.Items.map(item => item[queryParams.distinctParam]))],
            minSize: _.minBy(data.Items, queryParams.minByParam),
            maxSize: _.maxBy(data.Items, queryParams.maxByParam),
            qtyByType:  _.countBy(data.Items, queryParams.countByParam)
        }
        resolve(results);
    });
}

/**
 * 
 * @param {s3objectkey} key
 * @description Function that receives the s3ObjectKey and retrieves it's download link 
 */
let getImage = (key) => {

    const params = {
        Bucket: bucketName,
        Key: key
    };

    const operation = 'getObject';

    return new Promise((resolve, reject) => {
        s3.getSignedUrl(operation, params, (err, url) => {
            if (err !== null) reject(err);
            else resolve(url);
        })
    });
   
};

/**
 * 
 * @param s3 - Received s3 constant 
 * @param bucket - Received bucketName
 * @param key - s3ObjectKey
 * @description Function that retrieves the dimensions (height and width) and also the type
 */
let getDimensionsAsync = (s3, bucket, key) => {
    return new Promise(function(resolve, reject) {
        size(s3, bucket, key, function (err, dimensions) {
            if (err !== null) reject(err);
            else {
                resolve(dimensions);
            } 
        })
    });
}

/**
 * 
 * @param {TableName} params
 * @description Function that retrieves that extracts the metadata of the latest image and saves it into dynamoDB 
 */
let extractMetadata = async(params)  => {
    const response  = await s3.listObjectsV2({
        Bucket: bucketName
    }).promise()
    .then(result =>{
        let item =  result.Contents.sort((o1, o2) => { 
            start = o1.LastModified.getTime();
            end = o2.LastModified.getTime();
            return end - start;
        }).shift();

        return item;
    })
    .catch(err => {
        throw new Error(err);
    });

    return new Promise( function(resolve, reject) { 
            let responseResult = response;
            let responseParams = params;
            getDimensionsAsync(s3, bucketName, response.Key)
            .then(result => { 
                responseResult.Dimensions = result;
                params.Item = {
                    "id_s3object" : uuid.v5.URL,
                    "s3objectkey" :  responseResult.Key,
                    "last_modification" : responseResult.LastModified.getTime(),
                    "insert_time" : new Date().getTime(),
                    "e_tag" : responseResult.ETag,
                    "img_size" : responseResult.Size,
                    "storage_class" : responseResult.StorageClass,
                    "height": responseResult.Dimensions.height,
                    "width": responseResult.Dimensions.width,
                    "type": responseResult.Dimensions.type
                };
                console.log(params)
                saveToDynamoDbTable(params).then(resolve(responseResult))
                                           .catch(err => {new Error(err)});
                   
            })
            .catch(err => { new Error(err)});
        }
    );

}

/**
 * 
 * @param {TableName, Item} params
 * @description Function that saves the object into DynamoDB 
 */
let saveToDynamoDbTable = (params) => {
    dynamoDb.put(params, function(err, data) {
        if (err) console.log(JSON.stringify(err, null, 2));
        else console.log((data, null, 2))}).promise();
}


module.exports = {
    getMetadata,
    extractMetadata,
    getImage,
    infoImages
}
'use strict';
/**
 * The image management service module
 */
const manageImagesService = require('./manageImagesService');

// Function Hello
/**
 * @description Function that tests the API
 */
module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'v1.0'
      },
      null,
      2
    ),
  };
};


// Function GetMetaData
/**
 * 
 * @param event 
 * @param context 
 * @param callback
 * @description Function that get the metadata of a given s3ObjectKey at the DynamoDb's image table 
 */
module.exports.getMetadata = async  (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      s3objectkey: event.queryStringParameters.key,
    },
  };
  return await manageImagesService.getMetadata(params)
   .then(result => {
      const response =  {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      callback(null, response);
   })
   .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch any image.'));
   })
};

// Function ExtractMetadata
/**
 * @param callback
 * @description Function that extracts the metadata from the uploaded s3 image and write the informations at DynamoDB 
 */
module.exports.extractMetadata = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE
  };
  return await manageImagesService.extractMetadata(params)
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      if(callback) callback(null, response);
    })
    .catch(error => {
      console.error(error);
      if(callback) callback(new Error(error));
    })
};

// Function GetImage
/**
 * 
 * @param event 
 * @param callback
 * @description Function that gets the image from s3 by its s3ObjectKey and retrives the image's download link 
 */
module.exports.getImage =  (event, context, callback) => {
  const params = {
    Key: {
      s3objectkey : event.queryStringParameters.key,
    },
  };

  manageImagesService.getImage(params.Key.s3objectkey)
    .then(data => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data)
      }
      if (callback) callback(null, response);
    })
    .catch(error => {
      console.error(error);
      if(callback) callback(new Error(error));
    })
}

// Function InfoImages
/**
 * 
 * @param event  
 * @param callback
 * @description Function that lists the stored images informations like:
 * the smallest image, the larger image, the number of images by type, the present types. 
 */
module.exports.infoImages = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ProjectionExpression: "s3objectKey, #k, height, width, img_size, #t",
    ExpressionAttributeNames: { "#k": "s3objectkey", "#t" : "type" },
  }

  const queryParams = {
    minByParam: event.queryStringParameters.minBy,
    maxByParam: event.queryStringParameters.maxBy,
    distinctParam: event.queryStringParameters.distinctParam,
    countByParam: event.queryStringParameters.countByParam
  }

  return await manageImagesService.infoImages(params, queryParams)
  .then(result => {
     const response =  {
       statusCode: 200,
       body: JSON.stringify(result)
     }
     callback(null, response);
  })
  .catch(error => {
     console.error(error);
     callback(new Error('Couldn\'t fetch any image.'));
  })

} 


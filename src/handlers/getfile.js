import commonMiddleware from '../libs/commonMiddleware';

import createError from 'http-errors';
import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
//TODO:implement visibility check

const dynamoDB=new AWS.DynamoDB.DocumentClient();


async function getfile(event, context) {
    let files;
  
  const {id}=event.pathParameters;
  console.log(id)

  let params={
    TableName:process.env.FILES_TABLE_NAME,
    Key:{id}
  }

  let params1={
    TableName:process.env.FILES_TABLE_NAME,
    Key:{id},
    UpdateExpression:'set #view=#view + :val',
    ExpressionAttributeValues:{
        ":val": 1
    },
    ExpressionAttributeNames:{
        '#view':'view',
    },
    ReturnValues:'ALL_NEW',
  }

  let params2={
    TableName:process.env.FILES_TABLE_NAME,
    Key:{id},
    UpdateExpression:'set #view=#view - :val',
    ExpressionAttributeValues:{
        ":val": 1
    },
    ExpressionAttributeNames:{
        '#view':'view',
    },
    ReturnValues:'ALL_NEW',
  }

  try{
    const updateview=await dynamoDB.update(params1).promise();
    const result=await dynamoDB.get(params).promise();
    const {visible}=result.Item;
    if(!visible){
        await dynamoDB.update(params2).promise()
    
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'link is expired ask owner to share again'}),
          };
    }
    files=result.Item;

  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if(!files){
    throw new createError.NotFound(`file with id:${id} not found`);
}

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'users files',files}),
  };
}

export const handler = commonMiddleware(getfile);



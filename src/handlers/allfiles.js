import commonMiddleware from '../libs/commonMiddleware';

import createError from 'http-errors';
import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';


const dynamoDB=new AWS.DynamoDB.DocumentClient();


async function allfiles(event, context) {
  console.log(event.requestContext.authorizer);
  const {principalId}=event.requestContext.authorizer
  const userid=principalId.split('|')[1];
  let files;
  let params={
    TableName:process.env.FILES_TABLE_NAME,
    IndexName:'userindex',
    KeyConditionExpression:'userid=:userid',
    ExpressionAttributeValues:{
      ':userid':userid
    }
};

  try{
    const result=await dynamoDB.query(params).promise();

    files=result;

  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'users files',files}),
  };
}

export const handler = commonMiddleware(allfiles);



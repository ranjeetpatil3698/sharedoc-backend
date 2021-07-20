import commonMiddleware from '../libs/commonMiddleware';

import createError from 'http-errors';
import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
//TODO:implement visibility check

const dynamoDB=new AWS.DynamoDB.DocumentClient();


async function updatefile(event, context) {
    let files;
    
    const {type}=event.body;
    const {id}=event.pathParameters;
    let value;
    if(type==="visible"){
        value=event.body.value;
    }

    if(type==='validity'){
        value=event.body.newdate;
    }

 

  let paramsvisible={
    TableName:process.env.FILES_TABLE_NAME,
    Key:{id},
    UpdateExpression:'set visible=:val',
    ExpressionAttributeValues:{
        ":val": value
    },
    ReturnValues:'ALL_NEW',
  }

  let paramsvalidity={
    TableName:process.env.FILES_TABLE_NAME,
    Key:{id},
    UpdateExpression:'set validity=:val',
    ExpressionAttributeValues:{
        ":val": value
    },
    ReturnValues:'ALL_NEW',
  }

 

  try{
    // const result=await dynamoDB.get(params).promise();
    if(type==="visible"){
        await dynamoDB.update(paramsvisible).promise();
    }

    if(type==='validity'){
        await dynamoDB.update(paramsvalidity).promise();
    }
    
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

 
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `updated ${type} attribute`}),
  };
}

export const handler = commonMiddleware(updatefile);



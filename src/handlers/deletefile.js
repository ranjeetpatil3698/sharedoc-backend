import AWS from 'aws-sdk';
import { file } from 'babel-types';
import createError from 'http-errors';
import commonMiddleware from '../libs/commonMiddleware';
import { deletefilefroms3 } from '../libs/deletefilefroms3';

const dynamoDB=new AWS.DynamoDB.DocumentClient();



async function deletefile(event, context) {
  const {id}=event.pathParameters;
  const {filename}=event.body;


  try {
    const deletedfile=deletefilefroms3(filename);
    const result=await dynamoDB.delete(
      {
        TableName:process.env.FILES_TABLE_NAME,
        Key:{id}
      }
    ).promise()
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'File Deleted successfully',result,deletedfile}),
      };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
    
  }
}

export const handler =commonMiddleware (deletefile);



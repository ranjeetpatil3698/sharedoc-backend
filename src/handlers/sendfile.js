import commonMiddleware from '../libs/commonMiddleware';
import {findContentType} from '../libs/findContentType';
import {uploadPictureToS3} from '../libs/uploadPictureToS3';
import createError from 'http-errors';
import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';


const dynamoDB=new AWS.DynamoDB.DocumentClient();


async function sendfile(event, context) {
  console.log(event.requestContext.authorizer);
  const {principalId}=event.requestContext.authorizer
  const { filename } = event.pathParameters;
  const basestring=event.body;
  const [ContentType,data]=findContentType(basestring)
  // console.log(ContentType,data)
  const buffer=Buffer.from(data,'base64')
  let newfile;
  let resultdata;
  try{
    //1.uploading file
    newfile=await uploadPictureToS3(filename,buffer,ContentType);
    const updatedfile={
      userid:principalId.split("|")[1],
      id:uuid(),
      fileid:uuid(),
      visible:true,
      view:0,
      uploadDate:new Date().toString(),
      url:newfile.Location,
      filename,
      validity:null
    }
    //2.saving files data in db
    resultdata=await dynamoDB.put(
      {
        TableName:process.env.FILES_TABLE_NAME,
        Item:updatedfile
      }
    ).promise()

  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'File Submitted successfully',newfile,resultdata }),
  };
}

export const handler = commonMiddleware(sendfile);



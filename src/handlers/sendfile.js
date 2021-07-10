import commonMiddleware from '../libs/commonMiddleware';
import {findContentType} from '../libs/findContentType';
import {uploadPictureToS3} from '../libs/uploadPictureToS3';
import createError from 'http-errors';


async function sendfile(event, context) {
  console.log(event.requestContext.authorizer);
  const { filename } = event.pathParameters;
  const basestring=event.body;
  const [ContentType,data]=findContentType(basestring)
  // console.log(ContentType,data)
  const buffer=Buffer.from(data,'base64')
  let newfile;
  try{
    newfile=await uploadPictureToS3(filename,buffer,ContentType)
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'File Submitted successfully',newfile }),
  };
}

export const handler = commonMiddleware(sendfile);



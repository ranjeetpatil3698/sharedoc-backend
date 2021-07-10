import AWS from 'aws-sdk';

const s3=new AWS.S3();
const uploadPictureToS3=async(key,body,ContentType)=>{
    const result=await s3.upload({
    Bucket: process.env.FILES_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: ContentType,
    }).promise();

    return result;
}

export {uploadPictureToS3};
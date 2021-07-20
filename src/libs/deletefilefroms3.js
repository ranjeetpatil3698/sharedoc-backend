import AWS from 'aws-sdk';

const s3=new AWS.S3();
const deletefilefroms3=async(key)=>{
    const result=await s3.deleteObject({
    Bucket: process.env.FILES_BUCKET_NAME,
    Key: key,
    }).promise();

    return result;
}

export {deletefilefroms3};
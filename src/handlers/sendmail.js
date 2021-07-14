import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../libs/commonMiddleware';


const ses = new AWS.SES({ region: 'us-east-1' });


async function sendMail(event, context) {
  const {url,mail}=event.body;
  const {name}=event.requestContext.authorizer
  console.log(url,mail)

    let body=`<p>YOU CAN VIEW THE FILE HERE  ${url}</p><p>SENT USING FORMEASY}</p>`;
    let subject=`HI! ${name} HAS SHARED A FILE WITH YOU`;
  
  const params = {
    Source: 'patil.ranjeet.17ce1053@gmail.com',
    Destination: {
      ToAddresses: [mail],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'email sent successfully',result}),
      };
  } catch (error) {
    throw new createError.InternalServerError(error);
    console.error(error);
  }
}

export const handler =commonMiddleware (sendMail);



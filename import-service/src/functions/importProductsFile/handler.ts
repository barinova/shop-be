import AWS from 'aws-sdk';
import {S3Customizations} from 'aws-sdk/lib/services/s3';
import {APIGatewayProxyResult} from 'aws-lambda';
const BUCKET = 'product-file-store';

export const importProductsFile = async (event): Promise<APIGatewayProxyResult> => {
  const name: string = event.queryStringParameters?.name;

  if (!name || !name.endsWith('.csv')) {
    return {
      statusCode: 500,
      body: JSON.stringify('Expected .csv file extension.'),
    };
  }

  const s3: S3Customizations = new AWS.S3({ region: 'eu-west-1' });

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv'
  };

  try {
    const signedURL = await s3.getSignedUrl('putObject', params);
    console.log(signedURL);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(signedURL),
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: e
    };
  }
};

import AWS from 'aws-sdk';
import {S3Customizations} from 'aws-sdk/lib/services/s3';
import {APIGatewayProxyResult} from 'aws-lambda';
import {formatJSONResponse} from '@libs/api-gateway';
const BUCKET = 'product-file-store';

export const importProductsFile = async (event): Promise<APIGatewayProxyResult> => {
  const s3: S3Customizations = new AWS.S3({ region: 'eu-west-1' });
  const name: string = event.queryStringParameters?.name;

  console.log('EVENT: ', event);

  if (!name || !name.endsWith('.csv')) {
    return {
      statusCode: 500,
      body: JSON.stringify('Expected .csv file extension.'),
    };
  }

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv'
  };

  try {
    const signedURL = await s3.getSignedUrl('putObject', params);
    console.log(signedURL);
    return formatJSONResponse({ signedURL });
  } catch(e) {
    return {
      statusCode: 500,
      body: e
    };
  }
};

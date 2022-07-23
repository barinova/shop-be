import { APIGatewayProxyResult } from "aws-lambda";
import {getClient} from '@functions/test/pg-client';
import {Product} from 'models/product';

const queryProductsList = `select * from products;`;

export const getProductsList = async (event): Promise<APIGatewayProxyResult> => {
  console.log(`getProductsList: path params ${event.pathParameters}, query params ${event.queryStringParameters}`);
  const client = getClient();

  try {
    await client.connect();
    const products: Product[] = (await client.query(queryProductsList))?.rows;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products),
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: e
    };
  } finally {
    client.end();
  }
};

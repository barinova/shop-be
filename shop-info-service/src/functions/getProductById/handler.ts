import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {getClient} from '../test/pg-client';
import {Product} from 'models/product';

const NOT_FOUND: string = 'Not Found Product With Id';
const queryGetProductById: string = `  
  select * from products p
  join stocks s 
  on p.id = s.product_id and p.id = $1;
`;

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`getProductById: path params ${event.pathParameters}, query params ${event.queryStringParameters}`);
  const id = event.pathParameters?.id;
  const client = getClient();

  try {
    await client.connect();
    const product: Product = (await client.query(queryGetProductById, [id]))?.rows?.[0];
    console.log(product);

    if (!product) {
      throw `${NOT_FOUND} ${id}`;
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(product),
    }
  } catch (e) {
    const isNotFound: boolean = e.includes(NOT_FOUND);
    return {
      statusCode: isNotFound ? 404 : 500,
      body: JSON.stringify({
        message: e
      })
    };
  } finally {
    client.end();
  }
};

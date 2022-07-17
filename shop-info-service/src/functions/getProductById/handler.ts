import { PRODUCTS } from "../../mocks/products";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { emitConnectionDelay } from "../../mocks/delayFunc";

const NOT_FOUND: string = 'Not Found Product With Id';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.queryStringParameters?.id;

  try {
    await emitConnectionDelay(500);
    const product = PRODUCTS.find(x => x.id === id);

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
      body: e
    };
  }
};

import { PRODUCTS } from "../../mocks/products";
import {middyfy} from "@libs/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

const NOT_FOUND: string = 'Not Found Product With Id';

export const getProductById = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.queryStringParameters.id;

  try {
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
});

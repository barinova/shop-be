import { PRODUCTS } from "../../mocks/products";
import {middyfy} from "@libs/lambda";
import {APIGatewayProxyResult} from "aws-lambda";

export const getProductsList = middyfy(async (): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(PRODUCTS),
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: e
    };
  }
});

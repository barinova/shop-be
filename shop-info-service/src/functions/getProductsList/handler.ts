import { PRODUCTS } from "../../mocks/products";
import {APIGatewayProxyResult} from "aws-lambda";
import {emitConnectionDelay} from "../../mocks/delayFunc";

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    await emitConnectionDelay(500);
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
};

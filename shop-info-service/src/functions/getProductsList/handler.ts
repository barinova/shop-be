import { formatJSONResponse } from '@libs/api-gateway';
import { PRODUCTS } from "../../mocks/products";
import {middyfy} from "@libs/lambda";
import {APIGatewayProxyResult} from "aws-lambda";

export const getProductsList = middyfy(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    PRODUCTS
  })
});

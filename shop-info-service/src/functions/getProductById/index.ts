import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
  handler: `${handlerPath(__dirname)}/handler.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'get-product-by-id',
      },
    },
  ],
};

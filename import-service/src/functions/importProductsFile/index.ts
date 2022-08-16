import { handlerPath } from '@libs/handler-resolver';

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          name: 'basicAuthorizer',
          arn: 'arn:aws:lambda:eu-west-1:812253047139:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
          resultTtlInSeconds: 0,
          type: 'token'
        }
      },
    },
  ],
};

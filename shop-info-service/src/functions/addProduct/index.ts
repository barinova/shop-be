import { handlerPath } from '@libs/handler-resolver';

export const addProduct = {
    handler: `${handlerPath(__dirname)}/handler.addProduct`,
    events: [
        {
            http: {
                method: 'post',
                path: 'products',
                cors: true
            },
        },
    ],
};
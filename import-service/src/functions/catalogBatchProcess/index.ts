import {handlerPath} from '@libs/handler-resolver';

export const catalogBatchProcess = {
    handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
    events: [
        {
            sqs: {
                batchSize: 5,
                arn: {
                    'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
                }
            }
        }
    ]
};
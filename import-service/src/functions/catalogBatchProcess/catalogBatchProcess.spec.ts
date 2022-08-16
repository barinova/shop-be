import { SQSEvent, SQSRecord } from 'aws-lambda';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

import * as catalogBatchProcess from './handler';

const addProduct = require("../../../../shop-info-service/src/functions/addProduct/handler");
jest.mock('../../../../shop-info-service/src/functions/addProduct/handler');


const recordBase: SQSRecord = {
    messageId: 'b95df8e6-4394-4468-9d72-1747ca788e15',
    receiptHandle: '',
    body: JSON.stringify({
        title: 'Test product 1',
        description: 'Test product description 1',
        price: '12',
        count: '2'
    }),
    attributes: {
        ApproximateReceiveCount: '',
        AWSTraceHeader: '',
        SentTimestamp: '',
        SenderId: '',
        ApproximateFirstReceiveTimestamp: ''
    },
    messageAttributes: {},
    md5OfBody: '',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn',
    awsRegion: 'eu-west-1'
};

describe('catalogBatchProcess', () => {

    it('Must return error for empty file', async () => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SNS', 'publish', 'success');

        const event: SQSEvent = {
            Records: []
        };
        const code = (await catalogBatchProcess.catalogBatchProcess(event))?.statusCode;
        expect(code).toEqual(500);
    });

    it('Must add new product', async () => {
        const addProductResult = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(`Product with id 123 was successfully added.`),
        };

        addProduct.createProduct.mockReturnValue(addProductResult);
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SNS', 'publish', 'success');

        const event: SQSEvent = {
            Records: [recordBase]
        };
        const code = (await catalogBatchProcess.catalogBatchProcess(event))?.statusCode;
        expect(code).toEqual(200);
    });
});
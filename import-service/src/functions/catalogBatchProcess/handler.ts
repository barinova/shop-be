import {APIGatewayProxyResult, SQSEvent} from 'aws-lambda';
import AWS, { AWSError } from 'aws-sdk';
import { PublishResponse } from 'aws-sdk/clients/sns';
import { createProduct } from '../../../../shop-info-service/src/functions/addProduct/handler';

export const catalogBatchProcess = async (event: SQSEvent): Promise<APIGatewayProxyResult> => {
    console.log('catalogBatchProcess');

    try {
        const products = event.Records.map(({body}) => JSON.parse(body));
        console.log(products);

        const sns = new AWS.SNS();
        console.log('Publish sns');

        if (!products?.length) {
            throw 'Wrong file data';
        }

        await Promise.all(
            products.map((p) => {
                return createProduct({
                    title: p.title,
                    description: p.description,
                    price: p.price && Number.parseInt(p.price),
                    count: p.count && Number.parseInt(p.count)
                });
            })
        );

        await sns.publish(
            {
                Subject: 'New products have been added',
                Message: JSON.stringify(products),
                TopicArn: process.env.SNS_TOPIC_ARN,
                MessageAttributes: {
                    messageSize: {
                        DataType: 'String',
                        StringValue: products.length > 1 ? 'Multiple' : 'Single'
                    }
                }
            },
            (error: AWSError, data: PublishResponse) => {
                if (error) {
                    console.log('Error while sending email:', error);
                    return;
                }

                console.log('Email has been sent: ', data);
            }
        ).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: 'Products was successfully imported'
        };

    } catch (err) {
        console.log('Exception: ', err);
        return {
            statusCode: 500,
            body: `Unexpected error ${err.message}`,
        };
    }
}
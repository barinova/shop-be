import { SQSEvent } from 'aws-lambda';
import AWS, {AWSError} from 'aws-sdk';
import {PublishResponse} from 'aws-sdk/clients/sns';

export const catalogBatchProcess = async (event: SQSEvent) => {
    console.log('catalogBatchProcess');

    try {
        const products = event.Records.map(({body}) => JSON.parse(body));
        console.log(products);

        const sns = new AWS.SNS();
        console.log('Publish sns');

        await sns.publish(
            {
                Subject: 'New products have been added',
                Message: JSON.stringify(products),
                TopicArn: process.env.SNS_TOPIC_ARN
            },
            (error: AWSError, data: PublishResponse) => {
                if (error) {
                    console.log('Error while sending email:', error);
                    return;
                }

                console.log('Email has been sent: ', data);
            }
        ).promise();

    } catch (err) {
        console.log('Exception: ', err)
    }
}
import AWS, {SQS} from 'aws-sdk';
import {S3CreateEvent} from 'aws-lambda';
import csv from 'csv-parser';
import {S3Customizations} from 'aws-sdk/lib/services/s3';

export const importFileParser = async (event: S3CreateEvent) => {
    const sqs: SQS = new AWS.SQS();

    console.log('importFileParser');
    for (const record of event.Records) {
        const region = record.awsRegion;
        const s3: S3Customizations = new AWS.S3({ region });

        return await handleParse(s3, record.s3.object.key, record.s3.bucket.name, sqs);
    }
};

const handleParse = async (s3Client, key: string, bucketName: string, sqs: SQS) => {

    console.log('handleParse', key);
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        const s3Stream = s3Client.getObject(params).createReadStream();

        await new Promise(() => {
            const results: any[] = [];

            s3Stream.pipe(csv())
                .on('data', data => {
                    console.log('Parsed data: ', results);
                    results.push(data);
                    sendSqsMessage(data, sqs);
                })
                .on('error', err => {
                    console.log('Cannot parse :', key, err);
                    throw err;
                })
                .on('end', async () => {
                    await s3Client
                        .copyObject({
                            Bucket: bucketName,
                            Key: key.replace('uploaded/', 'parsed/'),
                            CopySource: `${bucketName}/${key}`,
                        })
                        .promise();

                    await s3Client
                        .deleteObject({
                            Bucket: bucketName,
                            Key: key,
                        })
                        .promise();

                    console.log('File moved to a new folder');
                });
        });

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "ContentType": "text/csv",
            }
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: `Can't parse file ${key}, the error ${err} occurred.`
        };
    }
};

const sendSqsMessage = (data, sqs: SQS) => {
    console.log('Send sqs msg');
    sqs.sendMessage(
        {
            QueueUrl: process.env.IMPORT_QUEUE_URL,
            MessageBody: JSON.stringify(data),
            DelaySeconds: 10
        },
        (error, data) => {
            if (error) {
                console.log('Failed to send sqs msg:', error);
                return;
            }
            console.log('Sqs message has been sent: ', data);
        }
    );
}

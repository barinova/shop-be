import {SQSEvent} from 'aws-lambda';

export const catalogBatchProcess = async (event: SQSEvent) => {
    console.log('catalogBatchProcess');

    try {
        const products = event.Records.map(({body}) => JSON.parse(body));
        console.log(products);
    } catch (err) {

    }
}
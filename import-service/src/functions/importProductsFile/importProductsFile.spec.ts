import {APIGatewayProxyResult} from 'aws-lambda';
import {importProductsFile} from './handler';
const AWS = require('aws-sdk');

const INCORRECT_EXTESION_FILE: string = 'test-file.png'
const CORRECT_EXTESION_FILE = 'test-file.csv';

describe('importProductsFile', () => {
    it('Returns signed url', async () => {
        const event: { queryStringParameters: { name: string } } = {
            queryStringParameters: { name: CORRECT_EXTESION_FILE }
        };

        const importResult: APIGatewayProxyResult = await importProductsFile(event);
        const signedURL: string = JSON.parse(importResult.body)?.signedUrl;

        expect(importResult.statusCode).toEqual(200);
        expect(signedURL).toBeDefined();
        expect(signedURL).toContain(CORRECT_EXTESION_FILE);
    });

    it('Returns error when passed not csv type', async () => {
        const event: { queryStringParameters: { name: string } } = {
            queryStringParameters: { name: INCORRECT_EXTESION_FILE }
        }

        const importResult: APIGatewayProxyResult = await importProductsFile(event);
        expect(importResult.statusCode).toEqual(400);
    });
});
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {NewProduct, Product} from 'models/product';
import {getClient} from '@functions/test/pg-client';
import {Stock} from 'models/stock';

const queryAddProduct: string = `  
  insert into products (title, description, price) values
  ($1, $2, $3)
  returning *;
`;

const queryAddProductInStock: string = `  
  insert into stocks (product_id, count) values
  ($1, $2)
  returning *;
`;

const validateProduct = (product: NewProduct): string | null => {
    return validateError(product.title, 'title', 'string')
        || validateError(product.price, 'price', 'number')
        || validateError(product.count, 'count', 'number')
        || validateError(product.description, 'description', 'string');
};

const validateError = (value: any, name: string, expectedType: string): string | null => {
    return !value || typeof value !== expectedType ? `Passed incorrect parameter ${name}` : null;
}

export const addProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`getProductById: path params ${event.pathParameters}, query params ${event.queryStringParameters}, body ${JSON.stringify(event.body)}`);

    const product: NewProduct = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    const error: string = validateProduct(product);

    if (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error
            })
        };
    }

    const client = getClient();

    try {
        await client.connect();

        await client.query('BEGIN');

        const p: Product = (await client.query(queryAddProduct, [
            product.title,
            product.description,
            product.price,
        ]))?.rows?.[0];

        if (!p) {
            throw 'Error while adding new product to products table';
        }

        const sp: Stock = (await client.query(queryAddProductInStock, [p.id, product.count]))?.rows?.[0];

        if (!sp) {
            throw 'Error while adding new product to stock table';
        }

        await client.query('COMMIT');

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(`Product with id ${p.id} was successfully added.`),
        }
    } catch (err) {
        await client.query('ROLLBACK');
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err
            })
        };
    } finally {
        client.end();
    }
}
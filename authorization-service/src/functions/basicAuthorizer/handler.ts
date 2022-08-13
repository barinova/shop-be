import {APIGatewayAuthorizerCallback, APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from 'aws-lambda';

export const basicAuthorizer = async (
    event: APIGatewayTokenAuthorizerEvent,
    _ctx: any,
    cb: APIGatewayAuthorizerCallback
) => {
    console.log('Event: ', JSON.stringify(event));

    if (event.type !== 'TOKEN' || !event.authorizationToken) {
        cb('Unauthorized');
    }

    try {
        const authToken = event.authorizationToken;
        console.log('authToken ', authToken);
        const credentials = authToken.split(' ')?.[1];
        const buff = Buffer.from(credentials, 'base64').toString('utf8');
        const plainCreds = buff.toString().split(':');
        const username = plainCreds[0];
        const password = plainCreds[1];

        console.log('Username: ', username, 'Password: ', password);

        const storedUserPassword = process.env[username];

        const effect = username && password && storedUserPassword === password ? 'Allow' : 'Deny';

        const policy = generatePolicy(username, effect, event.methodArn);

        console.log('Policy: ', JSON.stringify(policy));

        cb(null, policy);
    } catch (error) {
        cb(`Unauthorized: ${error}`);
    }
};


export const generatePolicy = (principalId: string, resource: string, effect: string = 'Allow'): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
});
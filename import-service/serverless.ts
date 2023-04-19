import type { AWS } from '@serverless/typescript';
import {importProductsFile} from '@functions/importProductsFile';
import {importFileParser} from '@functions/importFileParser';
import {catalogBatchProcess} from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    httpApi: {
      cors: true
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:listBucket'],
        Resource: ['arn:aws:s3:::product-file-store']
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['arn:aws:s3:::product-file-store/*']
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
          }
        ]
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [
          {
            Ref: 'createProductTopic'
          }
        ]
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: '',
      PG_PORT: '',
      PG_DATABASE: '',
      PG_USERNAME: '',
      PG_PASSWORD: '',
      IMPORT_QUEUE_URL: {
        Ref: 'catalogItemsQueue'
      },
      SNS_TOPIC_ARN: {
        Ref: 'createProductTopic'
      }
    },
  },
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'test1@eeemail.com',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            messageSize: ['Single']
          }
        }
      },
      SNSMultSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'test2@eeemail.com',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            messageSize: ['Multiple']
          }
        }
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          }
        }
      }
    }
  },
};

module.exports = serverlessConfiguration;

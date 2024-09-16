#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MvCdkAppStack } from '../lib/mv-cdk-app-stack';
import { DefaultStackSynthesizer } from 'aws-cdk-lib';


const defaultStackSynthesizer = new DefaultStackSynthesizer({
  fileAssetsBucketName:
    "cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}",
  bucketPrefix: "",

  imageAssetsRepositoryName:
    "cdk-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}",

  deployRoleArn: "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/LabRole",
  deployRoleExternalId: "",

  fileAssetPublishingRoleArn:
    "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/LabRole",
  fileAssetPublishingExternalId: "",

  imageAssetPublishingRoleArn:
    "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/LabRole",
  imageAssetPublishingExternalId: "",

  cloudFormationExecutionRole:
    "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/LabRole",

  lookupRoleArn: "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/LabRole",
  lookupRoleExternalId: "",

  bootstrapStackVersionSsmParameter: "/cdk-bootstrap/${Qualifier}/version",

  generateBootstrapVersionRule: true,
});


const app = new cdk.App();
new MvCdkAppStack(app, 'MvCdkAppStack', {
  synthesizer: defaultStackSynthesizer
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});



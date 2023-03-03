// @flow

import { loadEnv } from "../utils/loadEnv.js"
loadEnv()
import AWS from "aws-sdk"

const { IS_OFFLINE } = process.env

export const dynamoDbClient: any = new AWS.DynamoDB.DocumentClient(
  IS_OFFLINE
    ? {
        region: "localhost",
        endpoint: "http://localhost:8000",
      }
    : null,
)

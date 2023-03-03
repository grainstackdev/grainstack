// @flow

import { loadEnv } from "../utils/loadEnv.js"
loadEnv()
import { dynamoDbClient } from "./database.js"
import ID from "../utils/ID.js"
import type { TokenResGithub } from "../rest/GithubRest.js"

const { USER_TABLE } = process.env

export type User = {
  userId: string,
  oauth: {
    github?: TokenResGithub,
  },
  dateUpdated: number,
  dateCreated: number,
}

export default class UserAdapter {
  static async insertFromOauthGithub(
    tokenRes: TokenResGithub,
  ): Promise<string> {
    const userId = ID.getUnique()

    const data: User = {
      userId,
      oauth: {
        github: tokenRes,
      },
      dateUpdated: Date.now(),
      dateCreated: Date.now(),
    }

    const params = {
      TableName: USER_TABLE,
      Item: data,
    }

    await dynamoDbClient.put(params).promise()

    return userId
  }
}

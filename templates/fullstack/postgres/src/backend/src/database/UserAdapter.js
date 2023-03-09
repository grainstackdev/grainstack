// @flow

import type { TokenResGithub, UserResGithub } from "../rest/GithubRest.js"
import { loadEnv } from "../utils/loadEnv.js"
loadEnv()
import ID from "../utils/ID.js"
import sql from "sql-template-tag"
import Config from "../Config.js"
import database from "./database.js"

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
    userRes: UserResGithub,
  ): Promise<string> {
    const userId = ID.getHashed(userRes.id)

    const query = sql`
      INSERT INTO ${Config.dbPrefix}_User (
        userId,
        oauth
      ) VALUES (
        ${userId},
        ${JSON.stringify({ github: tokenRes })}
      ) ON CONFLICT (userId) DO UPDATE SET
      oauth = excluded.oauth,
      dateUpdated = CURRENT_TIMESTAMP;
    `

    await database.query(query)

    return userId
  }
}

// @flow

import { loadEnv } from "./utils/loadEnv.js"
loadEnv()
import nonMaybe from "../../common/src/nonMaybe.js"

const {
  OAUTH_GITHUB_CLIENT_ID,
  OAUTH_GITHUB_SECRET,
  SESSION_TOKEN_SECRET,
  IS_OFFLINE,
} = process.env

const port = 4000
const backendHost = IS_OFFLINE ? "http://localhost:4000" : "https://depl.to"

class Config {
  static dbPrefix: string = "test"

  // static dbHost: string = nonMaybe(DB_HOST)
  // static dbUser: string = nonMaybe(DB_USER)
  // static dbPassword: string = nonMaybe(DB_PASSWORD)
  // static dbDatabase: string = nonMaybe(DB_DATABASE)
  // static oauthGoogleId: string = nonMaybe(OAUTH_GOOGLE_ID)
  // static oauthGoogleSecret: string = nonMaybe(OAUTH_GOOGLE_SECRET)

  static oauthGithubClientId: string = nonMaybe(OAUTH_GITHUB_CLIENT_ID)
  static oauthGithubSecret: string = nonMaybe(OAUTH_GITHUB_SECRET)

  static port: number = port
  static webHost: string = IS_OFFLINE
    ? "http://localhost:4000"
    : "https://depl.to"
  static backendHost: string = backendHost

  static sessionTokenSecret: string = nonMaybe(SESSION_TOKEN_SECRET)
  static oauthRedirectUrl: string = `${backendHost}/oauth/github/end`
}

export default Config

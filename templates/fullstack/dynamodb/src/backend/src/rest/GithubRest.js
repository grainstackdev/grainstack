// @flow

import Config from "../Config.js"
import querystring from "querystring"
import axios from "axios"
import parseAxiosError from "../utils/parseAxiosError.js"

export type TokenResGithub = {
  access_token: string,
  // expires_in: string,
  // id_token: string,
  scope: string,
  token_type: string,
  // refresh_token: string,
}

export default class GoogleRest {
  static genAuthUrl(state: string): string {
    const qs = querystring.stringify({
      client_id: Config.oauthGithubClientId,
      redirect_uri: `${Config.backendHost}/oauth/github/end`,
      scope: "",
      state,
    })
    return `https://github.com/login/oauth/authorize?${qs}`
  }

  static async token(code: string): Promise<TokenResGithub> {
    let data = await send(
      "POST",
      "https://github.com/login/oauth/access_token",
      {
        code,
        client_id: Config.oauthGithubClientId,
        client_secret: Config.oauthGithubSecret,
        redirect_uri: Config.oauthRedirectUrl,
        grant_type: "authorization_code",
      },
    )
    data = querystring.parse(data)
    return data
  }
}

async function send(
  method: "GET" | "POST",
  url: string,
  data: ?{ [string]: any },
): any {
  const config: { url: string, ... } = {
    method: method.toLowerCase(),
    url,
  }

  if (method === "GET") {
    // $FlowFixMe
    config.params = data
  } else if (method === "POST") {
    // $FlowFixMe
    config.data = data
  }

  const res = await axios(config)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      return parseAxiosError(err)
    })

  return res
}

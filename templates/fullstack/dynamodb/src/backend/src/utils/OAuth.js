// @flow

import GithubRest from "../rest/GithubRest.js"
import ID from "./ID.js"
import UserAdapter from "../database/UserAdapter.js"
// import UserAdapter from "../sql/UserAdapter";

const states: {
  [state: string]: {
    finalPath: string,
  },
} = {}

function setState(state: string, finalPath: string) {
  states[state] = {
    finalPath,
  }
  setTimeout(() => {
    delete states[state]
  }, 1000 * 60 * 5)
}

export default class OAuth {
  static start(finalPath: string): { state: string, url: string } {
    if (!finalPath || !finalPath.startsWith("/")) {
      throw new Error("final_path must start with /")
    }

    const state = ID.getRandom()
    setState(state, finalPath)
    const url = GithubRest.genAuthUrl(state)
    return {
      state,
      url,
    }
  }

  static async end(
    cookieState: string,
    queryState: string,
    code: string,
  ): Promise<{
    userId: string,
    finalPath: string,
  }> {
    if (cookieState !== queryState) {
      console.debug("cookieState", cookieState)
      console.debug("queryState", queryState)
      throw new Error("The cookie state is invalid.")
    }
    const memoryState = states[queryState]
    if (!memoryState) {
      throw new Error("OAuth is expired.")
    }
    const tokenRes = await GithubRest.token(code)
    const userId = await UserAdapter.insertFromOauthGithub(tokenRes)
    return {
      userId,
      finalPath: memoryState.finalPath,
    }
  }
}

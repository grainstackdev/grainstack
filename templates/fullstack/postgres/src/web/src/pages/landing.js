// @flow

import { h as React } from "grainbox"
import Config from "../Config.js"

const element: HTMLElement = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <a href={`${Config.backendHost}/oauth/github/start?final_path=/home`}>
      Sign in
    </a>
  </div>
)

export default element

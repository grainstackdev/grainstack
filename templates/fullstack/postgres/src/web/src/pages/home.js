// @flow

import { h as React } from "grainbox"
import SessionStore from "../utils/SessionStore.js"

const element: HTMLElement = (
  <div>
    <a onClick={SessionStore.logout}>Sign Out</a>
  </div>
)

export default element

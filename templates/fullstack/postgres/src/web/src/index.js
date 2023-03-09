// @flow

import { registerRoute, reactive } from "grainbox"
import nonMaybe from "../../common/src/nonMaybe.js"
import SessionStore from "./utils/SessionStore.js"

const root = nonMaybe(document.getElementById("root"))

reactive(() => {
  const isLoggedIn = SessionStore.observables.isLoggedIn

  if (isLoggedIn) {
    // authenticated pages
    registerRoute(root, "/", () => import("./pages/home.js"))
  } else {
    registerRoute(root, "/", () => import("./pages/landing.js"))
  }
})

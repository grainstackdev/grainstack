// @flow

import decodeJwt from "jwt-decode"
import browserStore from "./browserStore.js"
import * as qss from "qss"
import Config from "../Config.js"
import { history, reactive } from "grainbox"

/*
The SessionStore handles loading the session from localStorage or sessionStorage
and other things like writing to the storage, handling session timeouts, etc.
* */

type Session = {
  userId: string,
}

class SessionStore {
  static sessionToken: ?string = null
  static session: ?Session = null
  static observables: { isLoggedIn: boolean } = reactive({
    isLoggedIn: false,
  })

  static checkForSessionCodeOnPageLoad() {
    const search = window.location.search
    if (search) {
      const { sessionCode } = qss.decode(search.slice(1))
      if (sessionCode) {
        history.clearSearch()
        fetch(`${Config.backendHost}/getSessionToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionCode,
          }),
        })
          .then((response) => {
            if (response.status !== 200) {
              response.text().then((err) => {
                console.error(err)
              })
            } else {
              return response.text()
            }
          })
          .then((sessionToken) => {
            if (sessionToken) {
              SessionStore.storeSessionToken(sessionToken)
            }
          })
      }
    }
  }

  static loadSessionTokenFromBrowser() {
    try {
      const sessionToken = browserStore.get("sessionToken")
      if (sessionToken) {
        const decoded = decodeJwt(sessionToken)
        SessionStore.sessionToken = sessionToken
        SessionStore.session = decoded
        SessionStore.observables.isLoggedIn = !!sessionToken // causes reactions
        console.warn("loaded sessionToken from browser")
        SessionStore.attemptTimeout()
      }
    } catch (err) {
      console.error(err)
    }
  }

  static storeSessionToken(sessionToken: string) {
    try {
      const decoded = decodeJwt(sessionToken)
      SessionStore.sessionToken = sessionToken
      SessionStore.session = decoded
      SessionStore.observables.isLoggedIn = !!sessionToken // causes reactions
      browserStore.set("sessionToken", sessionToken)
      console.warn("new sessionToken set", decoded)
    } catch (err) {
      console.error(err)
    }
  }

  static logout() {
    console.warn("logging out")
    SessionStore.sessionToken = null
    SessionStore.session = null
    SessionStore.observables.isLoggedIn = false // causes reactions
    browserStore.clearAll()
  }

  static attemptTimeout() {
    try {
      if (!SessionStore.sessionToken) return
      const decoded = decodeJwt(SessionStore.sessionToken)
      if (!decoded) {
        return
      }
      const exp = decoded.exp * 1000
      const minutesLeft = (exp - Date.now()) / 1000 / 60
      console.log("minutesLeft", minutesLeft)
      if (minutesLeft < 0) {
        SessionStore.logout()
      }
    } catch (err) {
      console.error(err)
    }
  }
}

SessionStore.loadSessionTokenFromBrowser()
SessionStore.checkForSessionCodeOnPageLoad()
setInterval(() => {
  SessionStore.attemptTimeout()
}, 1000)

export default SessionStore

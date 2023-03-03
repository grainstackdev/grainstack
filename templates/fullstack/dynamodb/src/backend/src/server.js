// @flow

import { loadEnv } from "./utils/loadEnv.js"
loadEnv()
import "./utils/Logmix.js"
import path from "path"
import { fileURLToPath } from "url"
// $FlowFixMe
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import express from "express"
import serverless from "serverless-http"
import fs from "fs"
import Cookies from "cookies"
import OAuth from "./utils/OAuth.js"
import Config from "./Config.js"
import {
  setSessionCode,
  getUserIdFromSessionCode,
  createSessionToken,
} from "./utils/Session.js"

const keys = ["9T9fNOr8o04PfTBRfZM/qMFPjMDmg3gdKmkwCpvKd1E="]

const app = express()

app.use(express.json())

app.use(function (req, res, next) {
  const timestamp = Date.now()
  req.timestamp = timestamp
  next()
})

// Append `req.clientIp`.
app.use(function (req, res, next) {
  try {
    const xForwardedFor = req.get("x-forwarded-for")?.split(", ") ?? []
    // If spoofed:
    // [0] is the spoofed ip
    // [1] is the client ip
    // [2:n-2] are intermediate proxies
    // [n-1] is the cloudfront proxy.
    //
    // If not spoofed:
    // [0] is the client ip
    // [1:n-2] are intermediate proxies
    // [n-1] is the cloudfront proxy.

    // If spoofed, there's at least 3.
    // If not, there's at least 2.

    const spoofOrClient = xForwardedFor[0] ?? "127.0.0.1"
    const clientOrProxy = xForwardedFor[1] ?? spoofOrClient

    if (xForwardedFor.length === 2) {
      req.clientIp = spoofOrClient
    } else {
      req.clientIp = clientOrProxy
    }

    if (!req.clientIp) {
      res.status(400).json({ error: "IP address unresolved." })
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: "IP address unresolved." })
  }
})

/**********************************
 *********** OAUTH START **********
 **********************************/

app.get("/oauth/github/start", async (req, res) => {
  try {
    res.set("Cache-Control", "no-cache")

    const { final_path } = req.query

    const { state, url } = OAuth.start(final_path)
    const cookies = new Cookies(req, res, { keys })
    cookies.set("state", state, {
      signed: true,
      maxAge: 60 * 5 * 1000,
      secure: Config.backendHost.startsWith("https") ? true : false,
      sameSite: "lax",
    })

    res.redirect(301, url)
  } catch (err) {
    console.error(err)
    res.status(400).send(err.message)
  }
})

app.get("/oauth/github/end", async (req, res) => {
  try {
    res.set("Cache-Control", "no-cache")

    const { code, state } = req.query
    const cookies = new Cookies(req, res, { keys })
    const cookieState = cookies.get("state", { signed: true })

    const { userId, finalPath } = await OAuth.end(cookieState, state, code)
    const sessionCode = setSessionCode(userId)

    res.redirect(
      301,
      `${Config.webHost}${finalPath}?sessionCode=${sessionCode}`,
    )
  } catch (err) {
    console.error(err)
    res.status(400).send(err.message)
  }
})

app.post("/getSessionToken", async (req, res) => {
  try {
    res.set("Cache-Control", "no-cache")

    const { sessionCode } = req.body

    const userId = getUserIdFromSessionCode(sessionCode)
    if (!userId) {
      throw new Error("Sorry, the sessionCode is expired.")
    }

    const sessionToken = await createSessionToken(userId)

    res.send(sessionToken)
  } catch (err) {
    console.error(err.message)
    res.status(400).send(err.message)
  }
})

/**********************************
 *********** OAUTH END ************
 **********************************/

/**********************************
 *********** WEB START ************
 **********************************/

function checkExtension(filepath: string) {
  const allowed = [".js", ".mjs", ".cjs", ".js.map", ".html"]
  const hit = allowed.find((ending) => filepath.endsWith(ending))
  if (!hit) {
    throw new Error("Has unsupported extension: " + filepath)
  }
}

app.get(/^\/common\/(.*)\/?$/i, async (req, res) => {
  const filepath = req.params["0"]
  try {
    checkExtension(filepath)
  } catch (err) {
    res.status(404).send(err.message)
    return
  }
  const finalFilePath = path.resolve(__dirname, `../../common/${filepath}`)
  let js = fs.readFileSync(finalFilePath, { encoding: "utf-8" })
  res.setHeader("content-type", "application/javascript")
  res.setHeader("x-content-type-options", "nosniff")
  res.send(js)
})

app.get(/^\/web\/(.*)\/?$/i, async (req, res) => {
  const filepath = req.params["0"]
  try {
    checkExtension(filepath)
  } catch (err) {
    res.status(404).send(err.message)
    return
  }
  const finalFilePath = path.resolve(__dirname, `../../web/${filepath}`)
  let js = fs.readFileSync(finalFilePath, { encoding: "utf-8" })
  res.setHeader("content-type", "application/javascript")
  res.setHeader("x-content-type-options", "nosniff")
  res.send(js)
})

app.get("/*", async (req, res) => {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../../web/src/index.html"),
    {
      encoding: "utf-8",
    },
  )
  res.send(html)
})

/**********************************
 *********** WEB END **************
 **********************************/

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  })
})

// $FlowFixMe
export const handler = serverless(app)

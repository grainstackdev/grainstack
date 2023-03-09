import { loadEnv } from "../utils/loadEnv.js"
loadEnv()
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
// $FlowFixMe
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { exec } from "child_process"
import { MongoClient } from "mongodb"
import tcpPortUsed from "tcp-port-used"

// version check:
const pkg =
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../package.json"), {
      encoding: "utf8",
    }),
  ) ?? {}
const version = pkg.version
if (!version) {
  throw new Error("package.version unresolved")
}

const { IS_OFFLINE, MONGO_DB_URL, MONGO_DB_DATABASE } = process.env

const MONGOD = "/opt/homebrew/bin/mongod"
const OFFLINE_URL = "mongodb://127.0.0.1:27017"

// Turn on mongod:
// $FlowFixMe
const portUsed = await tcpPortUsed.check(27017, "127.0.0.1")
console.info("portUsed", portUsed)
if (IS_OFFLINE && !portUsed) {
  // $FlowFixMe
  await new Promise((resolve, reject) => {
    const server = exec(`${MONGOD} --dbpath .mongodb`)
    server.stdout.on("data", (data) => {
      // console.info('mongod stdout:', data.toString())
      if (data.toString().includes("Waiting for connections")) {
        resolve()
      }
    })
    server.stderr.on("data", (data) => {
      console.info("mongod stderr:", data.toString())
    })
  })
  console.info("Local mongoDB server ready")
}

// connect client:
const client = new MongoClient(IS_OFFLINE ? OFFLINE_URL : MONGO_DB_URL)
// $FlowFixMe
await client.connect()
console.info("Connected successfully to server")
console.info("IS_OFFLINE", IS_OFFLINE)
export const db = client.db(MONGO_DB_DATABASE)

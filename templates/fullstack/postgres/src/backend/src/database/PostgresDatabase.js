import { loadEnv } from "../utils/loadEnv.js"
loadEnv()
import { default as pg } from "pg"

const { IS_OFFLINE, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } =
  process.env

let URL
if (IS_OFFLINE) {
  const { start } = await import("./localPostgresInterface.js")
  URL = await start(5555)
  console.log("URL", URL)
} else {
  URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}&sslmode=require`
}

export const pool = new pg.Pool({
  connectionString: URL,
})

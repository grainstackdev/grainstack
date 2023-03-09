// @flow

import * as localPostgres from "./localPostgresAdapter.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

// $FlowFixMe
const __dirname = dirname(fileURLToPath(import.meta.url))

// returns the server url
export async function start(port: number): Promise<string> {
  return await localPostgres.start({
    seedPath: path.resolve(__dirname, "schema.sql"),
    version: 14,
    port,
    includeInstallation: false,
    debugMode: false,
  })
}

export async function stop() {
  await localPostgres.stop()
}

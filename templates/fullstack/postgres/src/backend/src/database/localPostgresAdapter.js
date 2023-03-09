// @flow

import { execSync, spawn } from "child_process"
import { default as pg } from "pg"
import { platform } from "os"
import fs from "fs"

const PD_TEMP_DATA_PATH = `/tmp/postgres-local`

export async function start(
  options /*: {
  seedPath?: string,
  version?: number,
  username?: string,
  database?: string,
  port?: number,
  includeInstallation?: boolean,
  debugMode: boolean,
}*/,
) /*: Promise<string>*/ {
  const {
    seedPath,
    version = 14,
    username,
    database,
    port = 5555,
    includeInstallation = false,
    debugMode = false,
  } = options

  const execOptions /*: any*/ = {}

  if (debugMode) {
    execOptions.stdio = "inherit"
  }

  const who = username || execSync("whoami").toString().trim()

  const url = `postgres://${who}@localhost:${port}/postgres`

  const isClean = checkClean()
  const installScript = getInstallationScript({
    version,
    port,
    includeInstallation,
  })
  const startScript = getStartScript({ version, port })

  try {
    if (isClean) {
      console.log("Rebuilding database")
      execSync(installScript, execOptions)
    } else {
      console.log("Using existing database")
    }

    execSync(startScript, execOptions)

    // starting a server from scratch runs the schema.sql
    // restarting a server should ignore schema.sql
    // If schema changes are made, there needs to be a command to delete the database and re-run schema.sql

    console.log("Connecting to postgres...")
    const client = new pg.Client({
      connectionString: url,
    })
    client.connect()
    await new Promise((resolve, reject) => {
      // awaiting here to ensure DB is online before continuing.
      client.query(
        database ? `CREATE DATABASE ${database};` : "SELECT NOW();",
        (err, res) => {
          if (err) {
            return reject(err)
          }
          resolve(res)
        },
      )
    })
    console.log("Postgres available!")
    process.env.PSQL = url

    const shouldSeed = isClean && seedPath && seedPath?.length
    console.log("shouldSeed", shouldSeed)
    if (shouldSeed && seedPath) {
      console.log("Found seed file, seeding...")
      const file = fs.readFileSync(seedPath, { encoding: "utf-8" })
      client.query(file, (err, res) => {
        if (err) {
          console.error(err)
          return
        }
        console.log("Seed done available!")
        client.end()
      })
    }

    process.once("SIGUSR2", () => {
      console.log("nodemon kill signal")
      stop()
      process.exit()
    })

    process.on("SIGINT", () => {
      console.log("ctrl+c kill signal")
      stop()
      process.exit()
    })

    if (database) {
      return `postgres://${who}@localhost:${port}/${database}`
    } else {
      return url
    }
  } catch (e) {
    console.error(e)
    stop(options)
    throw e
  }
}

export function stop(
  options /*:: ?: { version?: number, debugMode: boolean }*/,
) /*: void*/ {
  const execOptions /*: any*/ = {}

  if (options?.debugMode) {
    execOptions.stdio = "inherit"
  }
  const stopScript = getStopScript({ version: options?.version })
  execSync(stopScript, execOptions)
  console.log("postgres server stopped")
}

function checkClean() /*: boolean*/ {
  try {
    const isDir = fs.lstatSync(PD_TEMP_DATA_PATH).isDirectory()
    return !isDir
  } catch (err) {
    return true
  }
}

export function clean() {
  execSync(`rm -rf ${PD_TEMP_DATA_PATH}`)
}

export function getInstallationScript(
  {
    version = 14,
    port,
    includeInstallation: includeInstallation = false,
  } /*: any*/,
) /*: string*/ {
  switch (platform()) {
    case "darwin": {
      const installation = includeInstallation
        ? `brew install postgresql@${version};`
        : ""

      return `
       ${installation}
       mkdir -p ${PD_TEMP_DATA_PATH}/data
       initdb -D ${PD_TEMP_DATA_PATH}/data
      `
    }
    case "win32": {
      throw new Error("Unsupported OS, try run on OS X or Linux")
    }
    default: {
      // eslint-disable-next-line
      const installation = includeInstallation
        ? `sudo apt update; sudo apt install postgresql-${version};`
        : ""

      return `
        ${installation}
        sudo -u postgres mkdir -p ${PD_TEMP_DATA_PATH}/data;
        sudo -u postgres /usr/lib/postgresql/${version}/bin/initdb -D ${PD_TEMP_DATA_PATH}/data;
      `
    }
  }
}

export function getStartScript(
  { version = 14, port = 5555 } /*: {
  version: number,
  port: number,
}*/,
) /*: string*/ {
  switch (platform()) {
    case "darwin": {
      return `pg_ctl -D ${PD_TEMP_DATA_PATH}/data -o "-F -p ${port}" -l ${PD_TEMP_DATA_PATH}/logfile start`
    }
    case "win32": {
      throw new Error("Unsupported OS, try run on OS X or Linux")
    }
    default: {
      return `sudo -u postgres /usr/lib/postgresql/${version}/bin/pg_ctl -o "-F -p ${port}" -D ${PD_TEMP_DATA_PATH}/data -l ${PD_TEMP_DATA_PATH}/logfile start;`
    }
  }
}

export function getStopScript(options /*: { version?: number }*/) /*: string*/ {
  switch (platform()) {
    case "darwin": {
      return `pg_ctl stop -D ${PD_TEMP_DATA_PATH}/data\n `
    }
    default: {
      return `
        sudo -u postgres /usr/lib/postgresql/${
          options?.version || 14
        }/bin/pg_ctl stop -D ${PD_TEMP_DATA_PATH}/data
        sudo -u postgres rm -rf ${PD_TEMP_DATA_PATH}
      `
    }
  }
}

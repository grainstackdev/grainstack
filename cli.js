#!/usr/bin/env node

import minimist from 'minimist'
import c from 'ansi-colors'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = minimist(process.argv.slice(2))
const args = argv._

const motd = `Usage: grainstack create <name>`

if (!args.length) {
  console.log(motd)
  process.exit(0)
} else if (args[0] === 'create') {
  const name = args[1]
  if (!name) {
    console.log(c.red(`Incorrect usage. Expected a name.\n${c.green('Correct Usage: grainstack create <name>')}`))
    process.exit(1)
  }

  const dest = path.resolve(process.cwd(), name)

  fs.copySync(path.resolve(__dirname, 'templates/fullstack/dynamodb'), dest, {
    errorOnExist: true
  })
}

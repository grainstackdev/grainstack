// @flow

import path, { dirname } from "path"
import { getSchemaDirectives, makeSqlSchema } from "graphql-to-sql"
import { typeDefs } from "./schema.js"
import Config from "../Config.js"
import { fileURLToPath } from "url"

// $FlowFixMe
const __dirname = dirname(fileURLToPath(import.meta.url))

const outputFilepath = path.resolve(__dirname, "../database/schema.sql")
console.log("schema generated at", outputFilepath)
const directives = getSchemaDirectives()
makeSqlSchema({
  typeDefs,
  schemaDirectives: directives,
  outputFilepath,
  schemaName: "public",
  tablePrefix: `${Config.stage}_`,
  dbType: "postgres",
})

// @flow

import { pool } from "./PostgresDatabase.js"

async function query(queryObject: {
  test: Array<string>,
  values: Array<string>,
}): Promise<any> {
  const res = await pool.query(queryObject)
  return res
}

export default {
  query,
}

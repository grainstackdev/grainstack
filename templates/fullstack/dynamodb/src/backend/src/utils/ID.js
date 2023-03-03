// @flow

import { v6 as uuidv6, v4 as uuidv4 } from "uuid-with-v6"
import crypto from "crypto"
import { encode } from "url-safe-base64"

function getUnique(): string {
  const id = uuidv6()
  return id.replace(/-/g, "").toUpperCase()
}

function getRandom(): string {
  const id = uuidv4()
  return id.replace(/-/g, "").toUpperCase()
}

function getStreamKey(): string {
  const key = encode(crypto.randomBytes(32).toString("base64"))
  return key
}

export default {
  getUnique,
  getRandom,
  getStreamKey,
}

// @flow

import ID from "./ID.js"
import * as jose from "jose"
import Config from "../Config.js"

const sessionUserIds: { [string]: string } = {}
const sessionCodes: { [string]: string } = {}
const timeouts: { [string]: any } = {}

export function setSessionCode(userId: string): string {
  if (timeouts[userId]) {
    clearTimeout(timeouts[userId])
    const existingCode = sessionUserIds[userId]
    delete timeouts[userId]
    delete sessionUserIds[userId]
    delete sessionCodes[existingCode]
  }

  const code = ID.getUnique()
  sessionUserIds[userId] = code
  sessionCodes[code] = userId
  timeouts[userId] = setTimeout(() => {
    delete sessionUserIds[userId]
    delete sessionCodes[code]
  }, 10 * 1000)
  return code
}

export function getUserIdFromSessionCode(code: string): ?string {
  return sessionCodes[code]
}

export async function createSessionToken(userId: string): Promise<string> {
  const secret = Buffer.from(Config.sessionTokenSecret, "base64")
  const alg = "HS256"

  const token = await new jose.SignJWT({
    userId,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(Config.backendHost)
    .setAudience(Config.webHost)
    .setExpirationTime("15m")
    .sign(secret)
  return token
}

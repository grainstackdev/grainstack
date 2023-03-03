// @flow

import traverse from "traverse"
import clone from "clone"

const fields = [
  /password/,
  /password_sha/,
  /identity/,
  /key/,
  /token/,
  /access_token/,
  /id_token/,
  /clientIp/,
]

export default function redact<T>(value: T): T {
  const v = clone(value)
  // $FlowFixMe
  return traverse(v).forEach(function (leaf: any) {
    const matchFound = fields
      .map((f) => f.test(this.key))
      .reduce((acc, cur) => {
        return acc || cur
      }, false)
    if (matchFound) {
      this.update("[REDACTED]", true)
      return
    }

    if (this.isLeaf && typeof this.node === "string") {
      try {
        const obj = JSON.parse(this.node)
        if (typeof obj === "object") {
          const redactedObj = redact(obj)
          this.update(JSON.stringify(redactedObj))
        }
      } catch (err) {}
    }
  })
}

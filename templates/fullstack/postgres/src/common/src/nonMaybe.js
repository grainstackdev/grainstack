// @flow

export default function nonMaybe<T>(value: T): $NonMaybeType<T> {
  if (value === null || value === undefined) {
    throw new Error(`Expected nonMaybe value`)
  }
  return value
}

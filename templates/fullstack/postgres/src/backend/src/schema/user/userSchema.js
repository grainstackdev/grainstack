// @flow

import gql from "graphql-tag"

export const typeDefs: any = gql`
  type User {
    userId: String @sql(type: "UUID", primary: true)
    oauth: JSON @sql
    dateUpdated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")
  }
`

export const resolvers = {
  User: {},
}

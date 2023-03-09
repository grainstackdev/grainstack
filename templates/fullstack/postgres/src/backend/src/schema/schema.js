// @flow

import type { DocumentNode } from "graphql"
import gql from "graphql-tag"
import GraphQLJSON from "graphql-type-json"
import * as User from "./user/userSchema.js"

export const typeDefs: DocumentNode = gql`
  scalar JSON

  directive @sql(
    unicode: Boolean
    constraints: String
    auto: Boolean
    default: String
    index: Boolean
    nullable: Boolean
    primary: Boolean
    type: String
    unique: Boolean
  ) on OBJECT | FIELD_DEFINITION

  # See graphql-directive-private
  directive @private on OBJECT | FIELD_DEFINITION

  ${User.typeDefs}
`

export const resolvers = {
  ...User.resolvers,
  JSON: GraphQLJSON,
}

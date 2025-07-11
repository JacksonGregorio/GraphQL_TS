export const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    position: Int!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    message: String!
    user: User!
    tokens: TokenInfo!
  }

  type TokenInfo {
    accessToken: String!
    refreshToken: String!
    expiresIn: String!
  }

  type RefreshPayload {
    message: String!
    accessToken: String!
    expiresIn: String!
  }

  type PermissionInfo {
    userId: ID!
    role: String!
    permissions: [String!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    position: Int = 4
    isActive: Boolean = true
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    position: Int
    isActive: Boolean
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RefreshTokenInput {
    refreshToken: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    me: User
    myPermissions: PermissionInfo
    searchUsers(
      name: String
      email: String
      position: Int
      isActive: Boolean
      limit: Int = 10
      offset: Int = 0
    ): [User!]!
    getUsersWithCriteria(
      evenIds: Boolean
      minPosition: Int
      maxPosition: Int
      isActive: Boolean
      limit: Int = 10
      offset: Int = 0
    ): [User!]!
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload!
    refreshToken(input: RefreshTokenInput!): RefreshPayload!
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    activateUser(id: ID!): User!
    deactivateUser(id: ID!): User!
    changeUserRole(id: ID!, position: Int!): User!
  }
`;

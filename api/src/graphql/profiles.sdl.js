export const schema = gql`
  type Profile {
    id: Int!
    name: String!
    title: String
    snippet: String
    url: String!
    createdAt: DateTime!
    search: Search!
    searchId: Int!
  }

  type Query {
    profiles: [Profile!]! @requireAuth
    profile(id: Int!): Profile @requireAuth
  }

  input CreateProfileInput {
    name: String!
    title: String
    snippet: String
    url: String!
    searchId: Int!
  }

  input UpdateProfileInput {
    name: String
    title: String
    snippet: String
    url: String
    searchId: Int
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile! @requireAuth
    updateProfile(id: Int!, input: UpdateProfileInput!): Profile! @requireAuth
    deleteProfile(id: Int!): Profile! @requireAuth
  }
`

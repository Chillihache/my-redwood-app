export const schema = gql`
  type SearchCount {
    profiles: Int!
  }

  type Search {
    id: Int!
    keywords: String!
    location: String
    createdAt: DateTime!
    user: User!
    userId: Int!
    profiles: [Profile]!
    _count: SearchCount
  }

  type Query {
    searches: [Search!]! @requireAuth
    search(id: Int!): Search @requireAuth
  }

  input CreateSearchInput {
    keywords: String!
    location: String
    userId: Int!
  }

  input UpdateSearchInput {
    keywords: String
    location: String
    userId: Int
  }

  type Mutation {
    createSearch(input: CreateSearchInput!): Search! @requireAuth
    updateSearch(id: Int!, input: UpdateSearchInput!): Search! @requireAuth
    deleteSearch(id: Int!): Search! @requireAuth
    scrapeNextPages(searchId: Int!): Int! @requireAuth
    resetAndScrape(searchId: Int!): Int! @requireAuth
  }
`
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type UserObj {
    id: ID!
    name: String!
    email: String!
  }

  type Message {
    content: String!
    sender: UserObj!
    receiver: UserObj!
    createdAt: String!
    id: ID!
  }

  input chatMessagesInput {
    receiverId: String!
  }

  type Query {
    users: [User]

    chatMessages(input: chatMessagesInput!): [Message]
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }

  type Token {
    accessToken: String!
    refreshToken: String!
    loggedInUser: User!
  }

  input MutationInput {
    receiverId: String!
    content: String!
  }

  type Mutation {
    signup(input: SignupInput!): User!

    login(input: LoginInput!): Token!

    createMessage(input: MutationInput!): Message!
  }

  type Subscription {
    messageSent: Message!
  }
`;

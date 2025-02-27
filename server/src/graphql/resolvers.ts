import { PubSub, withFilter } from "graphql-subscriptions";
import { getUsersExceptMe, login, signUp } from "../User/user.services";
import { chatMessages, createMessage } from "../Message/message.services";

const pubsub = new PubSub();

export const resolvers = {
  Mutation: {
    signup: async (parent: any, args: any, context: any) => {
      const result = await signUp(args);
      return result;
    },

    login: async (parent: any, args: any, context: any) => {
      const result = await login(args, context);
      return result;
    },

    createMessage: async (parent: any, args: any, context: any) => {
      const populatedMessage = await createMessage(args, context);
      pubsub.publish("MESSAGE_SENT", { messageSent: populatedMessage });
      return populatedMessage;
    },
  },

  Query: {
    users: async (parent: any, args: any, context: any) => {
      const result = await getUsersExceptMe(context);
      return result;
    },

    chatMessages: async (parent: any, args: any, context: any) => {
      const result = await chatMessages(args, context);
      return result;
    },
  },

  Subscription: {
    messageSent: {
      // using asyncIterator from PubSub to create the subscription
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator("MESSAGE_SENT"), // Correct way to use asyncIterator
        (payload, variables) => {
          // Optional filter function to handle different subscriptions
          return true; // Allow all events for this example
        }
      ),
    },
  },
};

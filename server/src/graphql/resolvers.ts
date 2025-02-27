import bcrypt from "bcryptjs";
import User from "../model/user.model";
import Message from "../model/message.model";
import jwt from "jsonwebtoken";
import { UserInputError, ApolloError } from "apollo-server-express";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubsub = new PubSub();

const generateAccessToken = (user: any) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET , {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
  });
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
  });
};

export const resolvers = {
  Mutation: {
    signup: async (parent: any, args: any, context: any) => {
      try {
        const { name, email, password } = args.input;

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email is already in use");
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user instance
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });

        // Save user to the database
        const savedUser = await user.save();
        
        return savedUser;
      } catch (error) {
        console.error("Error during signup:", error);
        throw new UserInputError(`Signup failed ${error}`);
      }
    },

    login: async (parent: any, args: any, context: any) => {
      try {
        const { email, password } = args.input;
        const { res } = context;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const user = await User.findByIdAndUpdate(existingUser._id, { isActive: true },{new:true});

        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);

        res.cookie("refreshToken", refreshToken,{
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
      
        return {
          accessToken,
          refreshToken,
          loggedInUser:user
        };
      } catch (error) {
        console.error("Error during Login:", error);
        throw new UserInputError(`Login failed ${error}`);
      }
    },

    createMessage: async (parent: any, args: any, context: any) => {
      try {
        if (!context.isLoggedIn) {
          throw new Error("Pls Login First");
        }

        const { receiverId, content } = args.input;

        if (!receiverId || !content) {
          throw new Error("ReceiverId and Content are required");
        }

        const senderUser = await User.findById({ _id: context.userId });
        const receiverUser = await User.findById({ _id: receiverId });
        if (!senderUser || !receiverUser) {
          throw new Error("User not found");
        }

        const message = await Message.create({
          content: content,
          sender: context.userId,
          receiver: receiverId,
        });
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email")
          .populate("receiver", "name email");

        pubsub.publish("MESSAGE_SENT", { messageSent: populatedMessage });
        return populatedMessage;
      } catch (error) {
        console.error("Error during Login:", error);
        throw new UserInputError(`Login failed ${error}`);
      }
    },
  },

  Query: {
    users: async (parent: any, args: any, context: any) => {
      try {
        if (!context.isLoggedIn) {
          throw new Error("Pls Login First");
        }
        const users = await User.find().sort({ createdAt: -1 }); //descending order

        const usersExceptCurrentUser = users.filter(
          (user) => user._id != context.userId
        );
        return usersExceptCurrentUser;
      } catch (error) {
        throw new ApolloError(`Error fetching users ${error}`);
      }
    },

    chatMessages: async (parent: any, args: any, context: any) => {
      try {
        if (!context.isLoggedIn) {
          throw new Error("Pls Login First");
        }

        const { receiverId } = args.input;
        const senderId = context.userId;

        if (!receiverId) {
          throw new Error("ReceiverId is required");
        }

        const messages = await Message.find({
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        })
          .sort({ createdAt: 1 })
          .populate("sender", "name email")
          .populate("receiver", "name email"); //ascending order

        return messages;
      } catch (error) {
        throw new ApolloError(`Error fetching users ${error}`);
      }
    },
  },

  Subscription: {
    messageSent: {
      // using asyncIterator from PubSub to create the subscription
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator('MESSAGE_SENT'), // Correct way to use asyncIterator
        (payload, variables) => {
          // Optional filter function to handle different subscriptions
          return true; // Allow all events for this example
        }
      ),
    },
  },
};

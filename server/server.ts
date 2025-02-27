import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express"; // Use ApolloServer from 'apollo-server-express'
// import { typeDefs } from "./src/graphql/schema";
// import { resolvers } from "./src/graphql/resolvers";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDef } from "./src/User/user-typedef";
import { messageTypeDef } from "./src/Message/message-typedef";
import { userResolvers } from "./src/User/user-resolver";
import { messageResolvers } from "./src/Message/message-resolver";
import { mergeResolvers } from "@graphql-tools/merge";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";

// const pubsub = new PubSub();

dotenv.config();

const app = express() as Application;
app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: "*",
    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const typeDefs = mergeTypeDefs([userTypeDef, messageTypeDef]);
const resolvers = mergeResolvers([userResolvers, messageResolvers]);
const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    introspection: true,
    context: ({ req, res }) => {
      //act as a middleware
      const { authorization } = req.headers;
      if (authorization) {
        const decoded = jwt.verify(
          authorization,
          process.env.JWT_SECRET ?? "DEll"
        ) as JwtPayload;
        const userId = decoded.userId;
        if (!userId) throw new Error("Invalid Token");
        return {
          isLoggedIn: true,
          userId,
          req,
          res,
        };
      } else {
        return { isLoggedIn: false, userId: null, req, res };
      }
      return { req, res };
    },
  });

  await server.start();

  // Apply Apollo Server middleware to Express
  server.applyMiddleware({ app, path: "/graphql", cors: false });

  httpServer.listen(4000, () => {
    console.log(`Server ready at http://localhost:4000/graphql`);
  });
  app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
  });
}

startServer().catch((error) => console.error("Error starting server:", error));

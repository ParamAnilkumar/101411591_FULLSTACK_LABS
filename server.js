const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
require('dotenv').config();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
const MONGO_URI = 'mongodb+srv://paramanilkumar:a9midU1t4g5azZ5H@cluster0.zlsyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("MongoDB connected");

  app.listen(4000, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
}

startServer();

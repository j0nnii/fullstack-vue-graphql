const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// Import environment variables and mongoose models
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to Mlab database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('db connected'))
.catch(err => console.error(err));

mongoose.set('useCreateIndex', true);

// Create Apollo/GraphQL server using typedefs, resolvers and context objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
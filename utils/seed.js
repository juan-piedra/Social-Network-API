const { User, Thought, Reaction } = require("../models");
const mongoose = require("mongoose");

const connection = require("../config/connection");

const users = [
  {
    username: "user1",
    email: "user1@email.com",
    thought: [],
  },
];

console.log(connection);

connection.once("open", async () => {
  console.log("connected");

  // Remove all existing users from the database.
  await User.deleteMany({});

  // Insert the seed user data into the User collection.
  await User.collection.insertMany(users);

  // Log the inserted users as a table.
  console.table(users);
  console.info("Seeding complete! 🌱");
  
  process.exit(0);
});

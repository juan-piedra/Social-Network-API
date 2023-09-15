const { User, Thought } = require("../models");

const userController = {
  // Get all users with populated thoughts and friends.
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .populate({ path: "thoughts", select: "-__v" })
        .populate({ path: "friends", select: "-__v" });

      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Get a single user by ID with populated thoughts and friends.
  async getUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate({ path: "thoughts", select: "-__v" })
        .populate({ path: "friends", select: "-__v" });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Create a new user.
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Update a user by ID.
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Delete a user by ID and their associated thoughts.
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      // Delete thoughts associated with the user.
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      return res.status(200).json({
        message: "User and associated thoughts and reactions deleted!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Add a friend to a user's friend list.
  async addFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!friend) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      return res.status(200).json(friend);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Delete a friend from a user's friend list by ID.
  async deleteFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!friend) {
        return res.status(404).json({ message: "Check user and friend ID" });
      }

      return res.status(200).json(friend);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
};

module.exports = userController;

const { User, Thought } = require("../models");

const thoughtController = {
  // Get all thoughts.
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      return res.status(200).json(thoughts);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Get a single thought by ID.
  async getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      return res.status(200).json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Create a new thought.
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findByIdAndUpdate(
        req.body.userId,
        { $addToSet: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );

      return res.status(200).json({ thought, user });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Update a thought by ID.
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this ID" });
      }

      return res.status(200).json(thought);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Delete a thought by ID.
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      return res.status(200).json({
        message: "Thought & associated reactions successfully deleted",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Add a reaction to a thought.
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      return res.status(200).json(reaction);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },

  // Delete a reaction from a thought by ID.
  async deleteReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res
          .status(404)
          .json({ message: "Check thought and reaction ID" });
      }

      return res.status(200).json(reaction);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;

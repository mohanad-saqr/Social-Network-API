const router = require('express').Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// GET all thoughts
router.get('/', async (req, res) => {
  const thoughts = await Thought.find();
  res.json(thoughts);
});

// GET a single thought by its _id
router.get('/:id', async (req, res) => {
  const thought = await Thought.findById(req.params.id);
  res.json(thought);
});

// POST a new thought
router.post('/', async (req, res) => {
  const thought = await Thought.create(req.body);
  await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } }, { new: true });
  res.json(thought);
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
  const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(thought);
});

// DELETE to remove a thought by its _id
router.delete('/:id', async (req, res) => {
  await Thought.findByIdAndDelete(req.params.id);
  res.json({ message: 'Thought deleted!' });
});

// POST to create a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  const thought = await Thought.findByIdAndUpdate(
    req.params.thoughtId,
    { $push: { reactions: req.body } },
    { new: true, runValidators: true }
  );
  res.json(thought);
});

// DELETE to remove a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  const thought = await Thought.findByIdAndUpdate(
    req.params.thoughtId,
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { new: true }
  );
  res.json(thought);
});

module.exports = router;

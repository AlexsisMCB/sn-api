const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ createdAt: -1 })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create thought
    createThought({ body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(400).json({ message: 'No user with this id!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },

    // update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true})
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought with this id!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // add reactions
    addReactions({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought with this id!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },

    // remove thought
    removeThought({ params, body }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true, runValidators: true }
                );
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No user with this id!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },

    // remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(thoughtData => res.json(thoughtData))
            .catch(err => res.json(err));
    }

};

module.exports = thoughtController;
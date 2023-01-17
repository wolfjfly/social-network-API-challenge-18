const { thoughts, users } = require('../models');

const thoughtsController = {
    getAllThoughts(req, res) {
        thoughts.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _d: -1 })
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getSingleThoughts({ params }, res) {
        thoughts.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.sendStatus(440);
            });
    },

    addThoughts({ params, body }, res) {
        thoughts.create(body)
            .then(({ _id }) => {
                return users.findOneAndUpdate(
                    { _id: params.usersId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        thoughts.findOneAndUpdate(
            { _id: params.thoughtsId },
            { $push: { reactions: body } },
            { new: true, runValidators: true })
            .populate({path: 'reactions', select: '-__v'})
            .select('-__v')
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({ message: 'No user found with this id!!' });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.json(err));
    },

    updateThoughts({ params, body }, res) {
        thoughts.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({ message: 'No thoughts found with this id '});
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.json(err));
    },

    deleteThoughts({ params }, res) {
        thoughts.findOneAndDelete({ _id: params.id })
            .then(dbThoughtsData => res.json(dbThoughtsData))
            .catch(err => res.json(err));
    },

    deleteReaction({ params }, res) {
        thoughts.findOneAndUpdate(
            { _id: params.thoughtsId }, 
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new: true})
            .then(dbThoughtsData => {
                if (!dbThoughtsData) {
                    res.status(404).json({ message: 'No thoughts with this ID!' });
                    return;
                }
                res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = thoughtsController;
const res = require('express/lib/response');
const { users } = require('../models');

const usersController = {
    getAllUsers(req, res) {
        users.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    getUsersById({ params }, res) {
        users.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    createUsers({ body }, res) {
        users.create(body)
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => res.json(err));
    },
    
    updateUsers({ params, body }, res) {
        users.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.json(err));
    },
    addFriend({ params }, res) {
        users.findOneAndUpdate(
            { _id: params.id },
            { $push: {  friends: params.friendId } },
            { new: true})
            .populate({path: 'friends', select: ('-__v')})
            .select('-__v')
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({ message: 'No user found with this id! '});
                    return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },
    deleteUsers({ params }, res) {
        users.findOneAndDelete({ _id: params.id })
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => res.json(err));
    },
    deleteFriend({ params }, res) {
        users.findOneAndUpdate({_id: params.id},
            {$pull: { friends: params.friendId}}, 
            {new: true})
            .populate({path: 'friends', select: '-__v'})
            .select('__v')
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({ message:  'No user with this id'});
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = usersController;
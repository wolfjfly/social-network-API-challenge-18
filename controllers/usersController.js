const res = require('express/lib/response');
const { users } = require('../models');

const usersController = {
    // get all users
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

    //get single user by id
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

    // create User
    createUsers({ body }, res) {
        users.create(body)
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => res.json(err));
    },
    
    // update user by id
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

    // add friend to user
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

    // delete user
    deleteUsers({ params }, res) {
        users.findOneAndDelete({ _id: params.id })
            .then(dbUsersData => res.json(dbUsersData))
            .catch(err => res.json(err));
    },

    // delete friend
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
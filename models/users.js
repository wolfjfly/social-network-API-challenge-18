const { Schema, model } = require('mongoose');

const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const usersSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true  

        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validateEmail, 'Email not valid'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thoughts'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        // prevents virtuals from creating duplicate of _id as 'id'
        id: false
    }
);

// get total count of friends on retrieval
usersSchema.virtual('friendsCount').get(function() {
    return this.friends.length;
});

const Users = model('users', UsersSchema);

module.exports = Users;
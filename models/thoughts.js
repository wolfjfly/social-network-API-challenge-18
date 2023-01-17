const { Schema, model, Types } = require('mongoose');
const moment = require('moment');


const reactionsSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt:{ 
            type: Date,
            default: Date.now,   
            get: createdAtVal => moment(createdAtVal).format('llll')
        }
    },
    {
    toJSON: {
        getters: true
        },
        id: false
    }
);

const thoughtsSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: createdAtVal => moment(createdAtVal).format('llll')
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionsSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

thoughtsSchema.virtual('reactionsCount').get(function() {
    return this.reactions.length;
});

const thoughts = model('thoughts', thoughtsSchema);

module.exports = thoughts;
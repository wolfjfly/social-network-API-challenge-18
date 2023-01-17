const router = require('express').Router();
const {
    getAllThoughts,
    getSingleThoughts,
    addThoughts,
    updateThoughts,
    deleteThoughts,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughtsController');

router
    .route('/')
    .get(getAllThoughts);

router
    .route('/:id')
    .get(getSingleThoughts) 
    .put(updateThoughts)
    .delete(deleteThoughts);

router
    .route('/:usersId')
    .post(addThoughts);

router
    .route('/:thoughtsId/reactions')
    .post(addReaction);

router
    .route('/:thoughtsId/reactions/:reactionId')
    .delete(deleteReaction);


module.exports = router;
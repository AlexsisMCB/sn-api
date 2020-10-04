const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    addFriend,
    removeFriend,
    deleteUser
} = require('../../controllers/user-controllers');

// Set up GET all and POST at /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// Set up GET a user, PUT, and DELETE at /api/users/:id
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Set up POST new friends and DELETE friend at /api/users/:userId/friends/:friendId
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);

module.exports = router;